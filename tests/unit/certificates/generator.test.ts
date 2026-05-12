import { checkAndIssueCertificate } from "@/services/certificates/lib/generator";

jest.mock("@/lib/db", () => ({
  __esModule: true,
  default: { query: jest.fn() },
}));

jest.mock("@/services/certificates/lib/queries", () => ({
  insertCertificate: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/services/certificates/lib/pdf", () => ({
  generateCertificatePdf: jest.fn().mockResolvedValue(Buffer.from("pdf")),
}));

jest.mock("@/services/certificates/lib/upload", () => ({
  uploadCertificate: jest
    .fn()
    .mockResolvedValue("https://res.cloudinary.com/test/cert.pdf"),
}));

import pool from "@/lib/db";
import { insertCertificate } from "@/services/certificates/lib/queries";

const mockQuery = pool.query as jest.Mock;

function mockDb(passingGrade: string, totalLessons: string, completedLessons: string, totalAssignments: string, passedAssignments: string, alreadyExists: boolean) {
  mockQuery
    .mockResolvedValueOnce({ rows: [{ value: passingGrade }] })       // getPassingGrade
    .mockResolvedValueOnce({ rows: [{ total: totalLessons, completed: completedLessons }] }) // allLessonsComplete
    .mockResolvedValueOnce({ rows: [{ total: totalAssignments, passed: passedAssignments }] }) // allAssignmentsPassed
    .mockResolvedValueOnce({ rows: [{ exists: alreadyExists }] });    // certificateAlreadyExists
}

describe("checkAndIssueCertificate", () => {
  it("issues certificate when all lessons and assignments are complete", async () => {
    mockDb("70", "5", "5", "3", "3", false);

    await checkAndIssueCertificate(1, 1);
    expect(insertCertificate).toHaveBeenCalledWith(
      1, 1, "https://res.cloudinary.com/test/cert.pdf"
    );
  });

  it("skips when lessons are not all complete", async () => {
    mockDb("70", "5", "3", "3", "3", false);

    await checkAndIssueCertificate(1, 1);
    expect(insertCertificate).not.toHaveBeenCalled();
  });

  it("skips when not all assignments passed", async () => {
    mockDb("70", "5", "5", "3", "2", false);

    await checkAndIssueCertificate(1, 1);
    expect(insertCertificate).not.toHaveBeenCalled();
  });

  it("skips when certificate already exists (idempotent)", async () => {
    mockDb("70", "5", "5", "3", "3", true);

    await checkAndIssueCertificate(1, 1);
    expect(insertCertificate).not.toHaveBeenCalled();
  });

  it("issues cert when no assignments exist for course", async () => {
    mockDb("70", "4", "4", "0", "0", false);

    await checkAndIssueCertificate(1, 2);
    expect(insertCertificate).toHaveBeenCalled();
  });
});

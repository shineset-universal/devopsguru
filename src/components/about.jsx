import React from "react";

export const About = (props) => {
  const flexDirection = props.revers? 'row-reverse':'row'
  return (
    <div id="about">
      <div className="container">
        <div className="row" style={{display:'flex',flexDirection}}>
          <div className="col-xs-12 col-md-6">
            {" "}
            <img src={props.data?.image} className="img-responsive" alt="" />{" "}
          </div>
          <div className="col-xs-12 col-md-6">
            <div className="about-text">
              <h2>{props.data?.title}</h2>
              <p>{props.data ? props.data.paragraph : "loading..."}</p>
              <h3>Topics</h3>
              <div className="list-style">
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why.map((d, i) => (
                          <li key={`${d}-${i}`} style={{color: "#faf7f7" }}>{d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
                <div className="col-lg-6 col-sm-6 col-xs-12">
                  <ul>
                    {props.data
                      ? props.data.Why2.map((d, i) => (
                          <li key={`${d}-${i}`} style={{color: "#faf7f7" }}> {d}</li>
                        ))
                      : "loading"}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

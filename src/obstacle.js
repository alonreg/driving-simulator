import React, { useState, useEffect } from "react";
import { constants } from "griddle-react";
import { normal } from "jstat";

class Obstacle {
  constructor(
    k,
    min,
    max,
    humanError,
    computerError,
    { success, pass_penalty, fail, rescue }
  ) {
    this.k = k;
    this.min = min;
    this.max = max;
    this.humanError = humanError;
    this.computerError = computerError;
    this.real_r = this.getRealObstacleValue(k, this.getXValue(max, min));
    this.real_l = this.getRealObstacleValue(k, this.getXValue(max, min));
    this.real_f = this.getRealObstacleValue(k, this.getXValue(max, min));
    this.ObstacleValueWithError_human_r = this.getObstacleValueWithError(
      this.real_r,
      humanError
    );
    this.ObstacleValueWithError_human_l = this.getObstacleValueWithError(
      this.real_l,
      humanError
    );
    this.ObstacleValueWithError_human_f = this.getObstacleValueWithError(
      this.real_f,
      humanError
    );
    this.ObstacleValueWithError_computer_r = this.getObstacleValueWithError(
      this.real_r,
      computerError
    );
    this.ObstacleValueWithError_computer_f = this.getObstacleValueWithError(
      this.real_l,
      computerError
    );
    this.ObstacleValueWithError_computer_f = this.getObstacleValueWithError(
      this.real_f,
      computerError
    );
    this.ev_r = this.getExpectedValue(this.real_r, success, fail, pass_penalty); // EV of right
    this.ev_l = this.getExpectedValue(this.real_l, success, fail, pass_penalty); // EV of left
    this.ev_f = this.getExpectedValue(this.real_f, success, fail, 0); //EV with no pass
    this.ev_rescue = rescue; // EV of rescue
    this.desicion = this.getComputerDecision();
    console.log(
      "Decisions Parameters: " +
        " k:" +
        this.k +
        "  reals: r = " +
        this.real_r +
        " l =  " +
        this.real_l +
        "  f = " +
        this.real_f +
        " ev_r = " +
        this.ev_r +
        " ev_l = " +
        this.ev_l +
        " ev_f = " +
        this.ev_f +
        " ev_rescue" +
        this.ev_rescue +
        " dec: " +
        this.desicion
    );
  }

  getComputerDecision() {
    if (
      this.ev_r < this.ev_rescue &&
      this.ev_l < this.ev_rescue &&
      this.ev_f < this.ev_rescue
    )
      return "rescue";

    if (this.ev_r >= this.ev_l && this.ev_r >= this.ev_f) {
      return "r";
    } else if (this.ev_l >= this.ev_f && this.ev_l >= this.ev_r) {
      return "l";
    } else {
      return "f";
    }
  }

  getXValue(max, min) {
    return Math.random() * min + max;
  }

  getRealObstacleValue(k, x) {
    return 1 / Math.exp(-1 * k * x);
  }

  getObstacleValueWithError(real, error) {
    let obstacleValueWithError = normal.cdf(
      normal.inv(real, 0, 1) + normal.inv(Math.random(), 0, error),
      0,
      1
    );
    console.log(obstacleValueWithError);
    return obstacleValueWithError;
  }

  getExpectedValue(failureProbabilty, successScore, failScore, pass) {
    return (
      (1 - failureProbabilty) * (successScore + pass) +
      failureProbabilty * (failScore + pass)
    );
  }

  /*
  function normDistCum(x, mean, std) {
    var x = (x - mean) / std
    var t = 1 / (1 + .2315419 * Math.abs(x))
    var d =.3989423 * Math.exp( -x * x / 2)
    var prob = d * t * (.3193815 + t * ( -.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))))
    if( x > 0 ) prob = 1 - prob
    return prob
  }
*/
}

export default Obstacle;

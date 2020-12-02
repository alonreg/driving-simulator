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
    success,
    pass,
    fail,
    rescue
  ) {
    this.k = k;
    this.min = min;
    this.max = max;
    this.humanError = humanError;
    this.computerError = computerError;
    this.real_r = this.getRealObstacleValue(k, this.getXValue(max, min));
    this.real_l = this.getRealObstacleValue(k, this.getXValue(max, min));
    this.real_f = this.getRealObstacleValue(k, this.getXValue(max, min));

    this.obstacleValueWithError_human_r = this.getObstacleValueWithError(
      this.real_r,
      humanError
    );
    this.obstacleValueWithError_human_l = this.getObstacleValueWithError(
      this.real_l,
      humanError
    );
    this.obstacleValueWithError_human_f = this.getObstacleValueWithError(
      this.real_f,
      humanError
    );
    this.obstacleValueWithError_computer_r = this.getObstacleValueWithError(
      this.real_r,
      computerError
    );
    this.obstacleValueWithError_computer_l = this.getObstacleValueWithError(
      this.real_l,
      computerError
    );
    this.obstacleValueWithError_computer_f = this.getObstacleValueWithError(
      this.real_f,
      computerError
    );
    this.ev_r = this.getExpectedValue(this.real_r, success, fail, pass); // EV of right
    this.ev_l = this.getExpectedValue(this.real_l, success, fail, pass); // EV of left
    this.ev_f = this.getExpectedValue(this.real_f, success, fail, 0); //EV with no pass
    this.ev_rescue = rescue; // EV of rescue
    this.decision = this.getComputerDecision();

    /*console.log(
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
        this.decision +
        "scores: success: " +
        success +
        " fail: " +
        fail +
        " pass: " +
        pass
    );*/
  }

  getComputerDecision() {
    if (
      this.ev_r < this.ev_rescue &&
      this.ev_l < this.ev_rescue &&
      this.ev_f < this.ev_rescue
    )
      return "rescue";

    if (this.ev_r >= this.ev_l && this.ev_r >= this.ev_f) {
      return "right";
    } else if (this.ev_l >= this.ev_f && this.ev_l >= this.ev_r) {
      return "left";
    } else {
      return "forward";
    }
  }

  getXValue(max, min) {
    const rnd = Math.random() * (max - min) + min;
    //console.log("rnd = " + rnd);
    return rnd;
  }

  getRealObstacleValue(k, x) {
    const exponent = 1 / (1 + Math.exp(-1 * k * x));
    /* console.log(
      "in get real obstacle value:" +
        " k= " +
        k +
        " x=" +
        x +
        " real = " +
        exponent
    );*/
    return exponent;
  }

  ncdf(x, mean, std) {
    var x = (x - mean) / std;
    var t = 1 / (1 + 0.2315419 * Math.abs(x));
    var d = 0.3989423 * Math.exp((-x * x) / 2);
    var prob =
      d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (x > 0) prob = 1 - prob;
    return prob;
  }

  getObstacleValueWithError(real, error) {
    const rnd = Math.random();
    //=NORM.DIST(NORM.INV(I2,$B$12,$B$13)+NORM.INV(RAND(),0,$B$14),$B$12,$B$13,TRUE)
    let obstacleValueWithError = normal.cdf(
      normal.inv(real, 0, 1) + normal.inv(rnd, 0, error), // should be changed to global variables?
      0,
      1
    );

    /*console.log(
      "value with error => error: " +
        error +
        " real: " +
        real +
        " normal inv " +
        normal.inv(0.37519, 0, 1) +
        " normal inv 22 " +
        normal.inv(0.8, 0, 1.5) +
        " cdf: " +
        this.ncdf(normal.inv(real, 0, 1) + normal.inv(rnd, 0, error), 0, 1) +
        " val with err: " +
        obstacleValueWithError
    );

    console.log(
      "compare: 1 - ncdf = " +
        this.ncdf(-1.714269295, 0, 1) +
        " jsstat = " +
        normal.cdf(
          -1.714269295, // should be changed to global variables?
          0,
          1
        )
    );*/

    return this.ncdf(normal.inv(real, 0, 1) + normal.inv(rnd, 0, error), 0, 1); // obstacleValueWithError;
  }

  getExpectedValue(failureProbabilty, successScore, failScore, pass) {
    const ev =
      (1 - failureProbabilty) * (successScore + pass) +
      failureProbabilty * (failScore + pass);
    /*console.log(
      "in getEV=> failureProb: " +
        failureProbabilty +
        " Success Score = " +
        successScore +
        " fail score = " +
        failScore +
        " pass " +
        pass +
        " ev " +
        ev
    );*/
    return ev;
  }
}

export default Obstacle;

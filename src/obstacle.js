import React, { useState, useEffect } from "react";
import { constants } from "griddle-react";
import { normal } from "jstat";

/**
 * This class handles the OBSTACLES,
 * which are the object a driver hits every once in a while
 */
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
  }

  // returns the decision made by the algorithm,
  // this will either be shown to the user or used for making a decision in AutoMode
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

  // gets a random value between min and max
  getXValue(max, min) {
    const rnd = Math.random() * (max - min) + min;
    return rnd;
  }

  // gets the real value of the obstacle, without user/computer error
  getRealObstacleValue(k, x) {
    const exponent = 1 / (1 + Math.exp(-1 * k * x));
    return exponent;
  }

  // ncdf stands for Normal Cumulative Distribution Function
  // Calculates the ncdf value for x, a mean, and standard deviation
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

  // returns the obstacle value, but with the error (either human error or computer error)
  getObstacleValueWithError(real, error) {
    const rnd = Math.random();
    return this.ncdf(normal.inv(real, 0, 1) + normal.inv(rnd, 0, error), 0, 1); // obstacleValueWithError;
  }

  // returns the EV for a specific direction.
  // This is used for the computer to choose a direction.
  // The computer chooses the highest EV option.
  getExpectedValue(failureProbabilty, successScore, failScore, pass) {
    const ev =
      (1 - failureProbabilty) * (successScore + pass) +
      failureProbabilty * (failScore + pass);
    return ev;
  }
}

export default Obstacle;

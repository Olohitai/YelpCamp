class ExpressError extends Error {
  constructor(message, statusCode) {
    //If we want to include additional information inide of our constructor
    //like this.message we add the super keyword which is refrencing the Error
    super(); //Everyother this. inside of Error
    this.message = message;
    this.statusCode = statusCode;
  }
}
module.exports = ExpressError;

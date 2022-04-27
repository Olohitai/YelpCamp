// function that takes a function as a parameter
module.exports = (func) => {
  //Returns a function with
  return (req, res, next) => {
    //Executes func and catches error
    //whatever catches get as the error it immediately calls next
    func(req, res, next).catch((e) => next(e));
  };
};
//We use this instead of wrapping everything in try and catch

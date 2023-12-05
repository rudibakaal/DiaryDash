module.exports = {
  url: process.env['MONGO_URI'] || 'mongodb+srv://bfskinner1995:nrG9ysYrGiKskNeR@cluster0.5w7y5ls.mongodb.net/diarydash?retryWrites=true&w=majority',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};


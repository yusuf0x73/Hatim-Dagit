//                                     BİSMİLLAHİRRAHMANİRRAHİM

require ('./lib/runner').run ().catch (error => {
  console.error (error.message);
  process.exit (1);
});

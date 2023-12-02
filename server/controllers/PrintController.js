const {uploadDocument, addPrintOrder, ModifyBalance} = require("../models/PrintConfirm");
const {showInfoPrintOder} = require("../models/PrintStatus");
const {showAllPrinter} = require("../models/Printer");



async function addFileOrder(req, res, next) {
  try {
    const result1 = await uploadDocument(req.body);
    req.body.document_id=result1.insertId;
    const result2 = await addPrintOrder(req.body);
    res.json(result2);
  } catch (err) {
    next(err);
  }
}

async function showStatus(req, res, next) {
  try {
    const result = await showInfoPrintOder(
      req.body.userInfo.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function MinusPages(req, res, next) {
  try {
    const result = await ModifyBalance(
      req.body.updatedBalance,
      req.body.userInfo.id
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function showInfoPrinter(req, res, next) {
  try {
    const result = await showAllPrinter();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addFileOrder,
  MinusPages,
  showStatus,
  showInfoPrinter
};
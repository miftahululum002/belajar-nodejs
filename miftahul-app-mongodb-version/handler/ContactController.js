const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../model/contact");
const { body, validationResult, check } = require("express-validator");
const getContacts = async (req, res) => {
  const contacts = await Contact.find();
  res.render("contact", {
    layout: "layouts/app",
    title: "Contacts",
    contacts,
    msg: req.flash("msg"),
    error: req.flash("error"),
  });
};

const addContact = (req, res) => {
  res.render("contact-add", {
    layout: "layouts/app",
    title: "Tambah Contact",
    error: req.flash("error"),
  });
};
const storeContact = (req, res) => {
  //   const errors = validationResult(req);
  //   if (!errors.isEmpty()) {
  //     req.flash("error", errors.array());
  //     return res.redirect("/contact/add");
  //   }
  Contact.insertMany(req.body);
  req.flash("msg", "Data berhasil disimpan");
  res.redirect("/contact");
};

const editContact = async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id });
  res.render("contact-edit", {
    layout: "layouts/app",
    title: "Edit Contact",
    contact,
    error: req.flash("error"),
  });
};

const getContactById = async (req, res) => {
  const contact = await Contact.findOne({ _id: req.params.id });
  res.render("contact-detail", {
    layout: "layouts/app",
    title: "Detail Contact",
    contact,
  });
};

const deleteContact = async (req, res) => {
  const contact = await Contact.findOne({ _id: req.body.id });
  if (!contact) {
    req.flash("error", "Data contact tidak ditemukan");
    return res.redirect("/contact");
  }
  await Contact.deleteOne({ _id: req.body.id }).then((result) => {
    req.flash("msg", "Data contact berhasil dihapus");
    res.redirect("/contact");
  });
};

const updateContact = async (req, res) => {
  await Contact.updateOne(
    { _id: req.body._id },
    {
      $set: {
        name: req.body.name,
        nohp: req.body.nohp,
        email: req.body.email,
      },
    }
  ).then((error, result) => {
    req.flash("msg", "Data contact berhasil disimpan");
    res.redirect("/contact");
  });
};

module.exports = {
  getContacts,
  addContact,
  storeContact,
  getContactById,
  editContact,
  deleteContact,
  updateContact,
};

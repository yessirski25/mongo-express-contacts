const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
// @desc get all contacts
// @route /api/Contacts
// @access private
const Contacts = asyncHandler(async(req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id});
    res.status(200).json(contacts);
});
// @desc get single contact
// @route /api/getContact
// @access private
const getContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("contact non existent");
    }
    res.status(200).json(contact);
});
// @desc create contact
// @route /api/createContact
// @access private
const createContact = asyncHandler(async(req, res) => {
    const { name, email, phone } = req.body;
    if ( !name || !email || !phone ){
        res.status(400);
        throw new Error("please fill all the fields");
    }

    const contact = await Contact.create({ name, email, phone, user_id: req.user.id})
    res.status(201).json(contact);
});
// @desc update contact
// @route /api/editContact
// @access private
const editContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("contact non existent");
    }
    
    if (contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("You don't have permission to update this contact!");
    }

    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedContact){
            res.status(400);
            throw new Error("Update Contact Failed!");
        }

        res.status(201).json(updatedContact);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
});
// @desc delete contact
// @route /api/deleteContact
// @access private
const deleteContact = asyncHandler(async(req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
        res.status(404);
        throw new Error("cannot delete non existing contact");
    }

    if (contact.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("You don't have permission to delete this contact!");
    }

    try {
        const deletedContact = await Contact.findByIdAndDelete(req.params.id);

        if (!deletedContact) {
            res.status(400);
            throw new Error("Deleting Contact Failed!");
        }

        res.status(201).json(deletedContact);

    } catch (err) {
        res.status(500).json({ message: err.message});
    }
});

module.exports = {
    Contacts,
    getContact,
    createContact,
    editContact,
    deleteContact
};
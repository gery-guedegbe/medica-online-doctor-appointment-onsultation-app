/**
 * MODULE: Packages - Controller
 * RESPONSABILITÉ: Thin controllers pour les packages
 * Voir: /docs/GUIDELINES_DOCS.md - Section 17
 */

const packageService = require('./package.service');

const create = async (req, res, next) => {
  try {
    const pkg = await packageService.createPackage(req.user.id, req.validatedData);
    res.status(201).json({ success: true, data: { package: pkg } });
  } catch (err) { next(err); }
};

const getByDoctor = async (req, res, next) => {
  try {
    const packages = await packageService.getPackagesByDoctor(req.params.doctorId);
    res.json({ success: true, data: { packages } });
  } catch (err) { next(err); }
};

const getMyPackages = async (req, res, next) => {
  try {
    const packages = await packageService.getMyPackages(req.user.id);
    res.json({ success: true, data: { packages } });
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const pkg = await packageService.updatePackage(req.user.id, req.params.id, req.validatedData);
    res.json({ success: true, data: { package: pkg } });
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    await packageService.deletePackage(req.user.id, req.params.id);
    res.json({ success: true, data: { message: 'Package supprimé' } });
  } catch (err) { next(err); }
};

module.exports = { create, getByDoctor, getMyPackages, update, remove };

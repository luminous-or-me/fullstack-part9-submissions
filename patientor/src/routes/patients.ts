import express from "express";
import patientService from "../services/patientService";
import { toNewPatient } from "../utils/utils";
import { toNewEntry } from "../utils/utils";
import { NewPatient, Patient } from "../types";

const router = express.Router();

router.get("/", (_req, res) => {
  res.json(patientService.getNonSensitivePatients());
});

router.get("/:id", (req, res) => {
  const id = req.params.id;

  const patient = patientService.findById(id);

  if (patient) {
    return res.json(patient);
  } else {
    return res.sendStatus(404);
  }
});

router.post("/", (req, res) => {
  try {
    const newPatient: NewPatient = toNewPatient(req.body);

    const addedPatient: Patient = patientService.addPatient(newPatient);

    res.status(201).json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong. ";

    if (error instanceof Error) {
      errorMessage += "Error: " + error.message;
    }

    res.status(400).json({ error: errorMessage });
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const newEntry = toNewEntry(req.body);
    const patient = patientService.findById(req.params.id);

    if (!patient) {
      res.status(404).json({ error: "Nonexistent user" });
    } else {
      const addedEntry = patientService.addEntry(newEntry, patient);
      res.status(201).json(addedEntry);
    }
  } catch (error: unknown) {
    let errorMessage = "Something went wrong. ";

    if (error instanceof Error) {
      errorMessage += "Error: " + error.message;
    }

    res.status(400).json({ error: errorMessage });
  }
});

export default router;

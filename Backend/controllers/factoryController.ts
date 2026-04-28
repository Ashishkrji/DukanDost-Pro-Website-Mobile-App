import { Request, Response } from 'express';

export const createController = (Model: any) => {
  return {
    getAll: async (req: Request, res: Response) => {
      try {
        const data = await Model.find().sort({ createdAt: -1 });
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
    getById: async (req: Request, res: Response) => {
      try {
        const data = await Model.findById(req.params.id);
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
    create: async (req: Request, res: Response) => {
      try {
        const newData = new Model(req.body);
        const savedData = await newData.save();
        res.status(201).json(savedData);
      } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
      }
    },
    update: async (req: Request, res: Response) => {
      try {
        const updatedData = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedData) return res.status(404).json({ message: 'Not found' });
        res.json(updatedData);
      } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
      }
    },
    delete: async (req: Request, res: Response) => {
      try {
        const deletedData = await Model.findByIdAndDelete(req.params.id);
        if (!deletedData) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    }
  };
};

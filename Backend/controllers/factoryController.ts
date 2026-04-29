import { Request, Response } from 'express';

export const createController = (Model: any) => {
  return {
    getAll: async (req: any, res: Response) => {
      try {
        const ownerId = req.ownerId || req.user.id;
        const data = await Model.find({ userId: ownerId }).sort({ createdAt: -1 });
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
    getById: async (req: any, res: Response) => {
      try {
        const ownerId = req.ownerId || req.user.id;
        const data = await Model.findOne({ _id: req.params.id, userId: ownerId });
        if (!data) return res.status(404).json({ message: 'Not found' });
        res.json(data);
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    },
    create: async (req: any, res: Response) => {
      try {
        const ownerId = req.ownerId || req.user.id;
        const newData = new Model({ ...req.body, userId: ownerId });
        const savedData = await newData.save();
        res.status(201).json(savedData);
      } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
      }
    },
    update: async (req: any, res: Response) => {
      try {
        const ownerId = req.ownerId || req.user.id;
        const updatedData = await Model.findOneAndUpdate(
          { _id: req.params.id, userId: ownerId }, 
          req.body, 
          { new: true, runValidators: true }
        );
        if (!updatedData) return res.status(404).json({ message: 'Not found' });
        res.json(updatedData);
      } catch (error) {
        res.status(400).json({ message: 'Bad Request', error });
      }
    },
    delete: async (req: any, res: Response) => {
      try {
        const ownerId = req.ownerId || req.user.id;
        const deletedData = await Model.findOneAndDelete({ _id: req.params.id, userId: ownerId });
        if (!deletedData) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
      }
    }
  };
};

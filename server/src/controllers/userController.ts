import { Request, Response } from 'express';
import { User } from '../models/User';
import { Address } from '../models/Address';
import { Wishlist } from '../models/Wishlist';
import { ensureOwnProfile } from '../middleware/authorization';

class UserController {
  // Get user profile
  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user.id).select('-password_hash');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response) {
    try {
      const { name, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, phone },
        { new: true, runValidators: true }
      ).select('-password_hash');
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  // Upload profile picture
  async uploadPicture(req: Request, res: Response) {
    try {
      // In a real app, this would handle file upload to S3
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { profile_picture_url: req.body.url },
        { new: true }
      ).select('-password_hash');
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to upload picture' });
    }
  }

  // Get user addresses
  async getAddresses(req: Request, res: Response) {
    try {
      const addresses = await Address.find({ user_id: req.user.id });
      res.json(addresses);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch addresses' });
    }
  }

  // Add new address
  async addAddress(req: Request, res: Response) {
    try {
      const address = new Address({
        ...req.body,
        user_id: req.user.id
      });
      await address.save();
      res.status(201).json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add address' });
    }
  }

  // Update address
  async updateAddress(req: Request, res: Response) {
    try {
      const address = await Address.findOneAndUpdate(
        { _id: req.params.id, user_id: req.user.id },
        req.body,
        { new: true }
      );
      
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      
      res.json(address);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update address' });
    }
  }

  // Delete address
  async deleteAddress(req: Request, res: Response) {
    try {
      const address = await Address.findOneAndDelete({
        _id: req.params.id,
        user_id: req.user.id
      });
      
      if (!address) {
        return res.status(404).json({ error: 'Address not found' });
      }
      
      res.json({ message: 'Address deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete address' });
    }
  }

  // Get wishlist
  async getWishlist(req: Request, res: Response) {
    try {
      const wishlist = await Wishlist.find({ user_id: req.user.id }).populate('product_id');
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch wishlist' });
    }
  }

  // Add to wishlist
  async addToWishlist(req: Request, res: Response) {
    try {
      const existing = await Wishlist.findOne({
        user_id: req.user.id,
        product_id: req.params.product_id
      });
      
      if (existing) {
        return res.status(400).json({ error: 'Product already in wishlist' });
      }
      
      const wishlistItem = new Wishlist({
        user_id: req.user.id,
        product_id: req.params.product_id
      });
      
      await wishlistItem.save();
      res.status(201).json(wishlistItem);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add to wishlist' });
    }
  }

  // Remove from wishlist
  async removeFromWishlist(req: Request, res: Response) {
    try {
      const wishlistItem = await Wishlist.findOneAndDelete({
        user_id: req.user.id,
        product_id: req.params.product_id
      });
      
      if (!wishlistItem) {
        return res.status(404).json({ error: 'Wishlist item not found' });
      }
      
      res.json({ message: 'Removed from wishlist' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove from wishlist' });
    }
  }
}

export const userController = new UserController();
```

```typescript
// SECURITY FIX: Update server entry point to use correct routes
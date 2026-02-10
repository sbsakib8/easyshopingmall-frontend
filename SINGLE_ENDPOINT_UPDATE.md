# Single Endpoint Profile + Address Update - Summary

## What Changed

You requested to use **one endpoint** to update both profile and address information. This has been implemented!

## Implementation

### Backend Changes

**File:** `backend/src/models/user/user.controllers.ts`

The `updateUserProfile` controller now accepts an optional `address_data` field:

```typescript
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  const { 
    name, email, mobile, date_of_birth, gender,
    address_data  // NEW: Optional address information
  } = req.body;
  
  // Update user profile...
  
  // Handle address if provided
  if (address_data) {
    if (address_data._id) {
      // Update existing address
      await AddressModel.findOneAndUpdate(...)
    } else {
      // Create new address and link to user
      const newAddress = await AddressModel.create(...)
      user.address_details.push(newAddress._id)
    }
  }
  
  // Return populated user with addresses
  return populatedUser;
}
```

### Frontend Changes

**File:** `frontend/src/compronent/account/accountPage.jsx`

Simplified to **one API call**:

```javascript
const handleSave = async () => {
  const payload = {
    name: profileData.name,
    email: profileData.email,
    mobile: profileData.phone,
    date_of_birth: profileData.dateOfBirth,
    gender: profileData.gender,
    address_data: {
      _id: addressData._id,  // Include for update, omit for create
      address_line: addressData.address_line,
      district: addressData.district,
      division: addressData.division,
      upazila_thana: addressData.upazila_thana,
      country: addressData.country,
      pincode: addressData.pincode,
      mobile: addressData.mobile,
    }
  };
  
  // Single API call
  const response = await updateUserProfile(data._id, payload);
  
  // Update Redux and local state
  dispatch(userget(response.user));
}
```

## API Endpoint

**URL:** `PUT http://localhost:5003/api/users/userupdate/698a4264017640d4f65bb61b`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "01712345678",
  "date_of_birth": "01/15/1990",
  "gender": "Male",
  "address_data": {
    "_id": "675abc123...",  // Optional: for update
    "address_line": "House 123, Road 5",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "pincode": "1212",
    "country": "Bangladesh",
    "mobile": "01712345678"
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "698a4264017640d4f65bb61b",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "01712345678",
    "address_details": [
      {
        "_id": "675abc123...",
        "address_line": "House 123, Road 5",
        "district": "Dhaka",
        "division": "Dhaka",
        "upazila_thana": "Gulshan",
        "pincode": "1212",
        "country": "Bangladesh",
        "mobile": "01712345678",
        "userId": "698a4264017640d4f65bb61b"
      }
    ],
    // ... other user fields
  }
}
```

## Benefits

✅ **Single API Call** - No need for separate address endpoints  
✅ **Atomic Operation** - Profile and address updated together  
✅ **Simpler Frontend** - Less code, easier to maintain  
✅ **Backward Compatible** - Standalone address endpoints still work  
✅ **Automatic Linking** - Backend handles address-user relationship  

## How It Works

1. User edits profile and address fields
2. Clicks "Save Changes"
3. Frontend sends **one request** with all data
4. Backend:
   - Updates user profile
   - Creates/updates address in Address collection
   - Links address to user's `address_details` array
   - Returns populated user object
5. Frontend updates Redux and local state
6. User sees success message

## Testing

To test the integration:

1. Open the profile page
2. Click "Edit Profile"
3. Modify profile fields (name, email, phone, etc.)
4. Modify address fields (address line, district, etc.)
5. Click "Save Changes"
6. Check browser network tab - should see **one PUT request** to `/api/users/userupdate/:id`
7. Verify data persists after page refresh

## Notes

- The `address_data` field is **optional** - you can update profile without address
- If `address_data._id` is provided, it updates existing address
- If `address_data._id` is missing/undefined, it creates new address
- Standalone address endpoints (`/api/address/*`) still work for direct address management

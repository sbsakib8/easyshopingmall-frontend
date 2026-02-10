# Address Management Integration

## Overview
The address management system has been integrated into the user profile update functionality. Users can now manage their delivery addresses through the profile page using a **single endpoint** that handles both profile and address updates.

## Backend Structure

### Address Model
Located at: `backend/src/models/address/address.model.ts`

Fields:
- `address_line`: Street address, house/building number
- `district`: District name
- `division`: Division/state name  
- `upazila_thana`: Sub-district/thana name
- `pincode`: Postal code
- `country`: Country (default: Bangladesh)
- `mobile`: Contact number for delivery
- `status`: Boolean flag (true = active, false = soft deleted)
- `userId`: Reference to the User who owns this address

### User Update Controller (Modified)
Located at: `backend/src/models/user/user.controllers.ts`

The `updateUserProfile` controller now accepts optional `address_data` (object) or `address_details` (array) fields in the request body. When provided, it:
1. Updates the user's profile information
2. Handles address intelligently:
   - If `_id` is provided and exists → **Updates** the existing address
   - If `_id` is NOT provided but user has address → **Updates** the existing address (Prevents duplicates)
   - If `_id` is provided but not found → **Creates** a new address (Forgiving behavior)
   - If no `_id` provided and no existing address → **Creates** a new address
3. Links the address to the user's `address_details` array if created
4. Returns the populated user object with address details

**Smart Behavior:** 
- **Duplicate Prevention:** If you update the profile without an address ID, the system will automatically update your existing address instead of creating a new one.
- **Forgiving Updates:** If you provide an address `_id` that doesn't exist, the system will create a new address instead of throwing an error.

### Address Controllers (Still Available)
Located at: `backend/src/models/address/address.controllers.ts`

Standalone endpoints still available for direct address management:
1. **POST /address/create** - Create new address
2. **GET /address/get** - Get all addresses for logged-in user
3. **PUT /address/update** - Update existing address
4. **DELETE /address/disable** - Soft delete address (sets status to false)

## Frontend Integration

### Single Endpoint Approach

**Endpoint:** `PUT /api/users/userupdate/:userId`

**Request Payload (Option 1 - address_data object):**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "mobile": "01234567890",
  "date_of_birth": "01/15/1990",
  "gender": "Male",
  "address_data": {
    "_id": "existing_address_id", // Optional: include for update, omit for create
    "address_line": "123 Main Street",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "pincode": "1212",
    "country": "Bangladesh",
    "mobile": "01234567890"
  }
}
```

**Request Payload (Option 2 - address_details array):**
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "mobile": "01234567890",
  "date_of_birth": "01/15/1990",
  "gender": "Male",
  "address_details": [
    {
      "_id": "existing_address_id", // Optional: include for update, omit for create
      "address_line": "123 Main Street",
      "district": "Dhaka",
      "division": "Dhaka",
      "upazila_thana": "Gulshan",
      "pincode": "1212",
      "country": "Bangladesh",
      "mobile": "01234567890"
    }
  ]
}
```

**Note:** Both formats are supported. If `address_details` array is provided, the first item will be used.

### Profile Page Integration
Located at: `frontend/src/compronent/account/accountPage.jsx`

#### How It Works:

1. **On Page Load:**
   - Fetches user data from Redux
   - Calls `getAddress()` API to load existing addresses
   - Populates address form fields with first address (if exists)

2. **When User Edits Profile:**
   - User clicks "Edit Profile" button
   - Can modify both profile info AND address fields
   - Address fields include:
     - Address Line
     - District
     - Division
     - Upazila/Thana
     - Pincode
     - Country

3. **When User Saves:**
   - **Single API call** to `/api/users/userupdate/:userId`
   - Payload includes both profile data AND `address_data` object
   - Backend handles:
     - Profile update
     - Address creation (if no `_id`) or update (if `_id` exists)
     - Linking address to user
   - Response includes populated user with address_details
   - Redux state is updated
   - Local address state is updated

### Key Changes Made:

**File: `backend/src/models/user/user.controllers.ts`**

Modified `updateUserProfile` to:
1. Accept optional `address_data` in request body
2. Create or update address based on presence of `_id`
3. Link new addresses to user's `address_details` array
4. Return fully populated user object with addresses

**File: `frontend/src/compronent/account/accountPage.jsx`**

Simplified `handleSave()` function to:
1. Build single payload with profile + address_data
2. Make one API call to user update endpoint
3. Handle response and update local state
4. Provide clear success/error messages

**File: `frontend/src/hook/useAuth.jsx`**

Added:
- `deleteAddress()` function for future use (soft delete addresses)

## Usage in Checkout

The checkout page (`frontend/src/compronent/checkout/checkOutComponent.jsx`) already uses address fields when creating orders. The delivery_address object includes:
- address_line
- district
- division
- upazila_thana
- pincode
- country
- mobile

This matches the Address model structure, ensuring consistency across the application.

## Benefits

1. **Separation of Concerns:** Addresses are stored in their own collection, not embedded in user documents
2. **Reusability:** Users can have multiple addresses (though UI currently shows first one)
3. **Data Integrity:** Address updates don't affect user profile updates
4. **Scalability:** Easy to extend with features like:
   - Multiple addresses per user
   - Default address selection
   - Address labels (Home, Work, etc.)
   - Address validation

## Future Enhancements

1. **Multiple Address Support:**
   - Show all user addresses in a list
   - Allow selection of default address
   - Add/edit/delete individual addresses

2. **Address Validation:**
   - Validate district/division combinations
   - Auto-suggest addresses based on pincode

3. **Checkout Integration:**
   - Allow users to select from saved addresses during checkout
   - Option to add new address during checkout

## Testing

To test the integration:

1. **Create Address:**
   - Login to user account
   - Go to Profile page
   - Click "Edit Profile"
   - Fill in address fields
   - Click "Save Changes"
   - Verify success message

2. **Update Address:**
   - Edit existing address fields
   - Click "Save Changes"
   - Verify updated data persists

3. **View Address:**
   - Navigate to "Addresses" tab
   - Verify address displays correctly
   - Check all fields are shown

## API Response Format

### Success Response:
```json
{
  "success": true,
  "message": "Address Created Successfully",
  "data": {
    "_id": "address_id",
    "address_line": "123 Main St",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "pincode": "1212",
    "country": "Bangladesh",
    "mobile": 1234567890,
    "userId": "user_id",
    "status": true,
    "createdAt": "2026-02-10T12:00:00.000Z",
    "updatedAt": "2026-02-10T12:00:00.000Z"
  }
}
```

### Error Response:
```json
{
  "success": false,
  "error": true,
  "message": "Error message here"
}
```

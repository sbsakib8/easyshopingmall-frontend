# Frontend Validation Fixes - Profile Update

## Issues Fixed

### 1. Invalid Date Error
**Error:** `Cast to date failed for value "Invalid Date"`

**Cause:** Frontend was sending empty string `""` for `date_of_birth` when the field was not filled.

**Fix:** Modified frontend to only include `date_of_birth` in the payload if it has a valid value.

```javascript
// Before (❌ Sent empty string)
const payload = {
  date_of_birth: profileData.dateOfBirth || "",  // Empty string causes error
};

// After (✅ Only send if valid)
const payload = {
  name: profileData.name || "",
  email: profileData.email || "",
  mobile: profileData.phone || "",
};

if (profileData.dateOfBirth && profileData.dateOfBirth.trim() !== "") {
  payload.date_of_birth = profileData.dateOfBirth;
}
```

### 2. Invalid Gender Enum Error
**Error:** `` is not a valid enum value for path `gender`

**Cause:** Frontend was sending empty string `""` for `gender` when not selected. The backend schema only accepts `"Male"`, `"Female"`, `"Other"`, or `null`.

**Fix:** Modified frontend to only include `gender` in the payload if it has a valid value.

```javascript
// Before (❌ Sent empty string)
const payload = {
  gender: profileData.gender || "",  // Empty string not in enum
};

// After (✅ Only send if valid)
if (profileData.gender && profileData.gender.trim() !== "") {
  payload.gender = profileData.gender;
}
```

## Updated Frontend Code

**File:** `frontend/src/compronent/account/accountPage.jsx`

```javascript
const handleSave = async () => {
  if (!data?._id) {
    toast.error("User ID not found");
    return;
  }

  try {
    // Build payload - only include fields with valid values
    const payload = {
      name: profileData.name || "",
      email: profileData.email || "",
      mobile: profileData.phone || "",
    };

    // Only add date_of_birth if it has a valid value
    if (profileData.dateOfBirth && profileData.dateOfBirth.trim() !== "") {
      payload.date_of_birth = profileData.dateOfBirth;
    }

    // Only add gender if it has a valid value
    if (profileData.gender && profileData.gender.trim() !== "") {
      payload.gender = profileData.gender;
    }

    // Add address data
    payload.address_data = {
      _id: addressData._id || undefined,
      address_line: addressData.address_line || "",
      district: addressData.district || "",
      division: addressData.division || "",
      upazila_thana: addressData.upazila_thana || "",
      country: addressData.country || "Bangladesh",
      pincode: addressData.pincode || "",
      mobile: addressData.mobile || profileData.phone || "",
    };

    const response = await updateUserProfile(data._id, payload);
    
    // ... rest of the code
  } catch (error) {
    // ... error handling
  }
};
```

## Backend Updates

### Role Enum Updated
**File:** `backend/src/models/user/user.model.ts`

Updated role enum values to uppercase:
```typescript
// Interface
role: "ADMIN" | "USER" | "INVESTMENT" | "SELLERPROGRAM" | "BOXLEADER" | "DROPSHIPPING";

// Schema
role: {
  type: String,
  enum: ['ADMIN', "USER", "INVESTMENT", "SELLERPROGRAM", "BOXLEADER", "DROPSHIPPING"],
  default: "USER"
}
```

### Route Permission Updated
**File:** `backend/src/models/user/user.routs.ts`

Removed `isAdmin` middleware from user update route so users can update their own profiles:
```typescript
// Before
router.put("/userupdate/:id", isAuth, isAdmin, updateUserProfile);

// After
router.put("/userupdate/:id", isAuth, updateUserProfile);
```

## Validation Rules

### date_of_birth
- **Type:** Date
- **Supported Formats:** 
  - `"MM/DD/YYYY"` (e.g., "02/13/2026")
  - `"YYYY-MM-DD"` (e.g., "2026-02-13")
- **Optional:** Yes (can be omitted)
- **Invalid values:** Empty string `""`, "Invalid Date", malformed dates
- **Valid values:** Properly formatted date string in either format, or omitted entirely
- **Backend Processing:** Automatically detects format and converts to UTC Date

### gender
- **Type:** String (Enum)
- **Allowed values:** `"Male"`, `"Female"`, `"Other"`
- **Optional:** Yes (can be omitted or null)
- **Invalid values:** Empty string `""`, any other string
- **Valid values:** One of the enum values or omitted entirely

## Testing

### Valid Request (All Fields)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "01234567890",
  "date_of_birth": "01/15/1990",
  "gender": "Male",
  "address_data": {
    "address_line": "123 Main St",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "pincode": "1212",
    "country": "Bangladesh",
    "mobile": "01234567890"
  }
}
```

### Valid Request (ISO Date Format)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "01234567890",
  "date_of_birth": "1990-01-15",
  "gender": "Male",
  "address_data": {
    "address_line": "123 Main St",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "pincode": "1212",
    "country": "Bangladesh",
    "mobile": "01234567890"
  }
}
```

### Valid Request (Minimal - No Optional Fields)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "01234567890",
  "address_data": {
    "address_line": "123 Main St",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "country": "Bangladesh"
  }
}
```

### Invalid Request (Will Cause Errors)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "01234567890",
  "date_of_birth": "",        // ❌ Empty string not allowed
  "gender": "",               // ❌ Empty string not allowed
  "address_data": { ... }
}
```

## Summary

✅ **Fixed:** Empty string validation errors for `date_of_birth` and `gender`  
✅ **Fixed:** Role enum type mismatch in TypeScript interface  
✅ **Updated:** User update route to allow non-admin users to update their profiles  
✅ **Improved:** Payload construction to only send valid values  

The frontend now properly validates and conditionally includes optional fields, preventing validation errors on the backend.

# Postman Testing Guide - Profile + Address Update

## Endpoint
```
PUT http://localhost:5003/api/users/userupdate/698a4264017640d4f65bb61b
```

## ✅ Working Example - Option 1 (address_data object)

**Request Body:**
```json
{
  "name": "demo",
  "email": "demo2@gmail.com",
  "mobile": "01815590453",
  "date_of_birth": "10/10/2025",
  "gender": "Male",
  "address_data": {
    "_id": "695fc5164cd6fd516779924c",
    "address_line": "Mirpur 10",
    "district": "khulna",
    "division": "khulna",
    "upazila_thana": "khulna sodor",
    "pincode": "1111",
    "country": "Bangladesh",
    "mobile": "1886439053"
  }
}
```

## ✅ Working Example - Option 2 (address_details array)

**Request Body:**
```json
{
  "name": "demo",
  "email": "demo2@gmail.com",
  "mobile": "01815590453",
  "date_of_birth": "10/10/2025",
  "gender": "Male",
  "address_details": [
    {
      "_id": "695fc5164cd6fd516779924c",
      "address_line": "Mirpur 10",
      "district": "khulna",
      "division": "khulna",
      "upazila_thana": "khulna sodor",
      "pincode": "1111",
      "country": "Bangladesh",
      "mobile": "1886439053"
    }
  ]
}
```

## Expected Response

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "698a4264017640d4f65bb61b",
    "name": "demo",
    "email": "demo2@gmail.com",
    "mobile": "01815590453",
    "image": null,
    "verify_email": false,
    "last_login_date": null,
    "status": "Active",
    "customerstatus": "NewCustomer",
    "address_details": [
      {
        "_id": "695fc5164cd6fd516779924c",
        "address_line": "Mirpur 10",
        "district": "khulna",
        "division": "khulna",
        "upazila_thana": "khulna sodor",
        "pincode": "1111",
        "country": "Bangladesh",
        "mobile": 1886439053,
        "status": true,
        "userId": "698a4264017640d4f65bb61b",
        "createdAt": "2026-01-08T14:54:14.145Z",
        "updatedAt": "2026-02-10T12:40:00.000Z",
        "__v": 0
      }
    ],
    "shopping_cart": [],
    "orderHistory": [],
    "role": "ADMIN",
    "date_of_birth": "2025-10-10T00:00:00.000Z",
    "gender": "Male",
    "createdAt": "2026-02-09T20:24:04.550Z",
    "updatedAt": "2026-02-10T12:40:00.000Z",
    "__v": 0
  }
}
```

## Creating New Address (No _id)

**Request Body:**
```json
{
  "name": "demo",
  "email": "demo2@gmail.com",
  "mobile": "01815590453",
  "date_of_birth": "10/10/2025",
  "gender": "Male",
  "address_data": {
    "address_line": "New Address Line",
    "district": "Dhaka",
    "division": "Dhaka",
    "upazila_thana": "Gulshan",
    "pincode": "1212",
    "country": "Bangladesh",
    "mobile": "01815590453"
  }
}
```

**Note:** Omit the `_id` field to create a new address. The backend will:
1. Create a new address in the Address collection
2. Add the address ID to the user's `address_details` array
3. Return the populated user with the new address

## Headers Required

```
Content-Type: application/json
Cookie: token=<your_jwt_token>
```

Or if using Authorization header:
```
Content-Type: application/json
Authorization: Bearer <your_jwt_token>
```

## Troubleshooting

### Issue: address_details is empty in response

**Cause:** You sent the data but the backend didn't process it.

**Solution:** Make sure you're using one of these formats:
- `address_data` (object) - recommended for frontend
- `address_details` (array) - backward compatible

### Issue: Getting a new address instead of updating existing one

**Cause:** The `_id` you provided doesn't exist or belongs to a different user.

**Behavior:** The system will **automatically create a new address** instead of throwing an error. This is intentional to make the endpoint more forgiving.

**Solution:** 
- To update an existing address, make sure the `_id` is correct
- Call `GET /api/address/get` to get the correct address IDs for the current user
- If you want to create a new address, simply omit the `_id` field

### Issue: Address mobile is null

**Cause:** The `mobile` field in address_data is a string, but the model expects a number.

**Solution:** Send mobile as a number (without quotes):
```json
"mobile": 1886439053  // ✅ Correct
"mobile": "1886439053"  // ❌ Will be converted but may cause issues
```

### Issue: Multiple addresses being created

**Cause:** Each time you send an invalid `_id`, a new address is created.

**Solution:**
- First time: Omit `_id` to create address
- Subsequent updates: Use the `_id` from the response
- Or call `GET /api/address/get` to get existing address IDs

## Testing Steps

1. **Get your user ID** from login response or profile endpoint
2. **Get existing address ID** (if updating):
   ```
   GET http://localhost:5003/api/address/get
   ```
3. **Update profile with address**:
   - Use the request body examples above
   - Include `_id` to update existing address
   - Omit `_id` to create new address
4. **Verify response** contains populated `address_details` array
5. **Refresh/Get profile** to confirm data persisted:
   ```
   GET http://localhost:5003/api/users/userprofile
   ```

## Key Points

✅ Both `address_data` (object) and `address_details` (array) are supported  
✅ If using `address_details` array, only the first item is processed  
✅ Include `_id` to update, omit to create new  
✅ Backend automatically links address to user  
✅ Response includes fully populated user with addresses  

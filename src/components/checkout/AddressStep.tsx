import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/lib/api";
import axios from "axios";

const AddressStep = ({ onAddressSelect, selectedAddress, onNext }) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "+91-",
    alternatePhone: "+91-",
    pincode: "",
    state: "",
    city: "",
    houseNumber: "",
    roadName: "",
    nearbyArea: "",
    addressType: "home",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await api.get("/user/addresses");
        if (response.data && Array.isArray(response.data)) {
          setAddresses(response.data);
          if (response.data.length > 0 && !selectedAddress) {
            onAddressSelect(response.data[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const fetchLocationDetails = async () => {
    if (!formData.pincode || formData.pincode.length !== 6) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }
    console.log(formData.pincode);

    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${formData.pincode}`
      );
      console.log(response);
      if (response.data) {
        setFormData({
          ...formData,
          state: response.data[0] ? response.data[0]?.PostOffice[0].Block : "",
          city: response.data[0] ? response.data[0]?.PostOffice[0].Region : "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch location details:", error);
      alert("Failed to fetch location details. Please enter manually.");
    } finally {
      setLoading(false);
    }
  };

  const saveAddress = async () => {
    // Validate form
    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.pincode ||
      !formData.state ||
      !formData.city ||
      !formData.houseNumber ||
      !formData.roadName
    ) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/user/addresses", formData);
      if (response.data) {
        const newAddress = response.data;
        setAddresses([...addresses, newAddress]);
        onAddressSelect(newAddress);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Delivery Address</h2>
        <Button onClick={() => setShowAddForm(true)}>Add New Address</Button>
      </div>

      {addresses.length > 0 && !showAddForm && (
        <div className="space-y-4">
          <RadioGroup
            value={selectedAddress?.id}
            onValueChange={(value) => {
              const selected = addresses.find((addr) => addr.id === value);
              if (selected) onAddressSelect(selected);
            }}
          >
            {addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start space-x-2 border p-4 rounded-lg"
              >
                <RadioGroupItem
                  value={address.id}
                  id={`address-${address.id}`}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <Label
                      htmlFor={`address-${address.id}`}
                      className="font-bold"
                    >
                      {address.fullName}
                    </Label>
                    <span className="uppercase text-sm bg-gray-100 px-2 py-1 rounded">
                      {address.addressType}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{address.phoneNumber}</p>
                  <p className="text-sm mt-2">
                    {address.houseNumber}, {address.roadName},{" "}
                    {address.nearbyArea},{address.city}, {address.state} -{" "}
                    {address.pincode}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-end mt-6">
            <Button onClick={onNext} disabled={!selectedAddress}>
              Continue to Order Summary
            </Button>
          </div>
        </div>
      )}

      {(showAddForm || addresses.length === 0) && (
        <div className="border p-6 rounded-lg space-y-4">
          <h3 className="font-semibold">Add New Address</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name*</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number*</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="alternatePhone">Alternate Phone Number</Label>
              <Input
                id="alternatePhone"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex space-x-2">
              <div className="flex-1">
                <Label htmlFor="pincode">Pincode*</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="flex items-end">
                <Button onClick={fetchLocationDetails} disabled={loading}>
                  {loading ? "Fetching..." : "Fetch Location"}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="state">State*</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                readOnly={loading}
              />
            </div>

            <div>
              <Label htmlFor="city">City*</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                readOnly={loading}
              />
            </div>

            <div>
              <Label htmlFor="houseNumber">House Number, Building Name*</Label>
              <Input
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="roadName">Road Name, Area*</Label>
              <Input
                id="roadName"
                name="roadName"
                value={formData.roadName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="nearbyArea">Nearby Area</Label>
              <Input
                id="nearbyArea"
                name="nearbyArea"
                value={formData.nearbyArea}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <Label>Address Type*</Label>
              <Select
                value={formData.addressType}
                onValueChange={(value) =>
                  handleSelectChange("addressType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select address type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            {addresses.length > 0 && (
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            )}
            <Button onClick={saveAddress} disabled={loading}>
              {loading ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressStep;
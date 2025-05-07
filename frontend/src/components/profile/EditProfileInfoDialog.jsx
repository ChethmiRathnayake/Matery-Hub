import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
} from "@mui/material";
import { Country, City } from "country-state-city";

import axios from "../../api/axios";
import useAxios from "../../hooks/useAxios";

const EditProfileInfoDialog = ({ open, onClose, user, onProfileUpdate }) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        country: "",
        city: "",
    });

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const { response: profile, error, loading, axiosFetch } = useAxios();

    useEffect(() => {
        const allCountries = Country.getAllCountries();
        setCountries(allCountries);
    }, []);
    useEffect(() => {
        if (formData.country) {
            const cityList = City.getCitiesOfCountry(formData.country);
            setCities(cityList);
        } else {
            setCities([]);
        }
    }, [formData.country]);

    useEffect(() => {
        if (user) {
            let countryCode = "";
            let cityName = "";

            if (user.location) {
                const [city, countryName] = user.location.split(",").map((s) => s.trim());

                // Get ISO code for the country name
                const matchedCountry = Country.getAllCountries().find(
                    (c) => c.name.toLowerCase() === countryName?.toLowerCase()
                );

                if (matchedCountry) {
                    countryCode = matchedCountry.isoCode;
                    cityName = city;
                }
            }

            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                bio: user.bio || "",
                country: countryCode,
                city: cityName,
            });
        }
    }, [user]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            ...(name === "country" && { city: "" }), // reset city if country changes
        }));
    };

    const getCountryName = (isoCode) => {
        const country = Country.getCountryByCode(isoCode);
        return country ? country.name : isoCode;
    };

    const handleSubmit = async () => {
        const location = formData.city && formData.country
            ? `${formData.city}, ${getCountryName(formData.country)}`
            : "";

        const updatedProfile = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            bio: formData.bio,
            location: location
        };


        try {

            await axiosFetch({
                axiosInstance: axios,
                method: "PUT",
                url: user._links?.update?.href,
                data: updatedProfile,
            });
            onProfileUpdate();
            onClose();
        } catch (error) {
            console.error("Error uploading profile picture:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Profile Info</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField
                        name="firstName"
                        label="First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="lastName"
                        label="Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        name="bio"
                        label="Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={3}
                    />

                    {/* Country Dropdown */}
                    <TextField
                        select
                        name="country"
                        label="Country"
                        value={formData.country}
                        onChange={handleChange}
                        fullWidth
                    >
                        {countries.map((c) => (
                            <MenuItem key={c.isoCode} value={c.isoCode}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* City Dropdown */}
                    <TextField
                        select
                        name="city"
                        label="City"
                        value={formData.city}
                        onChange={handleChange}
                        fullWidth
                        disabled={!formData.country || cities.length === 0}
                    >
                        {cities.map((c, idx) => (
                            <MenuItem key={idx} value={c.name}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditProfileInfoDialog;

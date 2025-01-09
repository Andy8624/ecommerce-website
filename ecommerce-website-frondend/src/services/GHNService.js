
import { GHN_TOKEN } from "../utils/Config";
import axios from 'axios';
const API_GHN_URL = 'https://dev-online-gateway.ghn.vn/shiip/public-api';

export const callProvinceFromGHN = async () => {
    const response = await axios.get(
        `${API_GHN_URL}/master-data/province`,
        {
            headers: {
                token: GHN_TOKEN,
                'Content-Type': 'application/json',
            },
        }
    );
    return response?.data?.data;
}

export const callDistrictFromGHN = async (cityId) => {
    const response = await axios.post(
        `${API_GHN_URL}/master-data/district`,
        { province_id: cityId },
        {
            headers: {
                token: GHN_TOKEN,
                'Content-Type': 'application/json',
            },
        }
    );

    return response?.data?.data;
}

export const callWardFromGHN = async (districtId) => {
    const response = await axios.post(
        `${API_GHN_URL}/master-data/ward`,
        { district_id: districtId },
        {
            headers: {
                token: GHN_TOKEN,
                'Content-Type': 'application/json',
            },
        }
    );
    return response?.data?.data;
}
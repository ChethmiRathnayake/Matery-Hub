import useAxios from "../hooks/useAxios";
import axios from "../api/axios";
import {useAuthContext} from "../hooks/useAuthContext";
import React, {useEffect} from "react";
const Test= () => {
    const { user } = useAuthContext();
    const { response: test, error, loading, axiosFetch } = useAxios();

    console.log(user.id)
    useEffect(() => {
        if (user?.accessToken) {

            axiosFetch({
                axiosInstance: axios,
                method: 'GET',
                url: `/user-profiles/${user.id}`

            });
        }
    }, [user]);
    console.log(test)


};

export default Test;
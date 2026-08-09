import api from "@/utils/axios";

const getCurrentUser = async () => {
    try {
        const { data } = await api.get("/api/user/me");
        return data;
    } catch (err) {
        return null;
    }
};

export default getCurrentUser;
import { Statistics } from "@/models/statistics"
import axiosInstance from "./agent"

export const getStatistics = async (): Promise<Statistics> => {
    try {
        const response = await axiosInstance.get('/statistics')
        return response.data
    } catch (error) {
        throw new Error(`Failed to get statistics`)
    }
}

export default { getStatistics }
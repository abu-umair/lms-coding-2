// Simpan di libs/courseStorage.js atau langsung di dalam komponen
export const saveCourseId = (id) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("current_course_id", id);
    }
};

export const getCourseId = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("current_course_id");
    }
    return null;
};

export const clearCourseId = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("current_course_id");
    }
};
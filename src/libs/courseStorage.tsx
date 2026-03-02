// Simpan di libs/courseStorage.js atau langsung di dalam komponen
export const saveCourseId = (id) => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("current_course_id");
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

export const setModeEdit = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("set_mode_edit");
        localStorage.setItem("set_mode_edit", "true");
    }
};

export const setModeCreate = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("set_mode_edit");
        localStorage.setItem("set_mode_edit", "false");
    }
};

export const getMode = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("set_mode_edit");
    }
    return null;
};
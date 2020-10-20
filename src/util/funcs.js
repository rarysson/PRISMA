function get_valid_number(number, min_val) {
    const n = number || min_val;

    return n >= min_val ? n : min_val;
}

function get_formatted_joint_type(type) {
    let t = type.replace("pn.", "").toLowerCase();
    t = t === "link" ? "arc" : t;

    return t;
}

export { get_valid_number, get_formatted_joint_type };

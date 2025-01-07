export const truncateDescription = (description, limit) => {
    if (limit == 0) return description;
    const words = description.split(" ");
    if (words.length > limit) {
        return words.slice(0, limit).join(" ") + "...";
    }
    return description;
};
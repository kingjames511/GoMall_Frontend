export function getPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
} {
    if (!password) return { score: 0, label: "", color: "" };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { score, label: "Weak", color: "#DC3545" };
    if (score <= 3) return { score, label: "Fair", color: "#E8782F" };
    if (score <= 4) return { score, label: "Good", color: "#F5A623" };
    return { score, label: "Strong", color: "#22A65A" };
}
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext useEffect - token:", token); // Debug log
    if (token) {
      // Verify token by fetching user data
      fetchUserData();
    } else {
      console.log("No token found, setting loading to false"); // Debug log
      setLoading(false);
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      // Get the current token from localStorage to ensure we have the latest one
      const currentToken = localStorage.getItem("token");
      console.log("Fetching user data with token:", currentToken); // Debug log

      if (!currentToken) {
        console.log("No token found in localStorage"); // Debug log
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
          Accept: "application/json",
        },
      });

      console.log("API response status:", response.status); // Debug log

      if (response.ok) {
        const data = await response.json();
        console.log("User authenticated:", data.user); // Debug log
        setUser(data.user);
      } else {
        console.log("Token invalid, clearing auth"); // Debug log
        // Token is invalid, clear it
        logout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log("Attempting login for:", email); // Debug log
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful, token received:", data.token); // Debug log
        localStorage.setItem("token", data.token);
        setToken(data.token);

        // Fetch user data directly with the new token
        try {
          const userResponse = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${data.token}`,
              Accept: "application/json",
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log("User data fetched:", userData.user); // Debug log
            setUser(userData.user);
          } else {
            console.log("Failed to fetch user data after login"); // Debug log
          }
        } catch (error) {
          console.error("Error fetching user data after login:", error);
        }

        return { success: true };
      } else {
        const error = await response.json();
        console.log("Login failed:", error); // Debug log
        return { success: false, error: error.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login network error:", error); // Debug log
      return { success: false, error: "Network error" };
    }
  };

  const register = async (username, email, password, fullName) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem("token", data.token);
        await fetchUserData();
        return { success: true };
      } else {
        const error = await response.json();
        return {
          success: false,
          error: error.message || "Registration failed",
        };
      }
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const logout = () => {
    if (token) {
      fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      }).catch(console.error);
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  console.log("AuthContext value:", {
    user,
    token,
    loading,
    isAuthenticated: !!user,
  }); // Debug log

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

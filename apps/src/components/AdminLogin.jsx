import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FaUser, FaLock } from "react-icons/fa";
import "./CSS/AdminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex items-center justify-center h-screen bg-blue-200">
      <Card className="w-96 p-6 bg-blue-900 text-white rounded-lg shadow-lg">
        <h2 className="text-center text-2xl mb-4">ADMIN LOGIN</h2>
        <CardContent>
          <div className="mb-4 relative">
            <Input
              type="text"
              placeholder="Username"
              className="w-full p-3 pl-10 bg-blue-800 text-white border-none rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
          <div className="mb-4 relative">
            <Input
              type="password"
              placeholder="Password"
              className="w-full p-3 pl-10 bg-blue-800 text-white border-none rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
          <div className="text-right text-sm mb-4">
            <a href="#" className="text-gray-300 hover:underline">
              Lost Password?
            </a>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

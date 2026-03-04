import { Routes, Route } from "react-router-dom";
import { DeviceList } from "@/pages/DeviceList";
import { DeviceDashboard } from "@/pages/DeviceDashboard";
import { ProfilesPage } from "@/pages/ProfilesPage";
import { ProfileEditor } from "@/pages/ProfileEditor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<DeviceList />} />
      <Route path="/device/:deviceId" element={<DeviceDashboard />} />
      <Route path="/profiles" element={<ProfilesPage />} />
      <Route path="/profiles/:profileId" element={<ProfileEditor />} />
    </Routes>
  );
}

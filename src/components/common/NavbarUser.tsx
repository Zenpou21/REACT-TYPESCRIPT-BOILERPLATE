import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import user_icon from "../../assets/images/sample_user_icon.png";
import { LogOutIcon } from "lucide-react";
import UseCookie from "../../hooks/useCookie";
import useEncryption from "../../hooks/useEncryption";
import SHARED_KEY from "../../globals/sharedKey";
import React from "react";
import useLogout from "../../hooks/useLogout";

export default function NavbarUser() {
  const { logout } = useLogout();
  const { decryptData } = useEncryption(SHARED_KEY);
  const { getCookie } = UseCookie();
  const [userData, setUserData] = React.useState<any>(null);
  React.useEffect(() => {
    const fetchUserData = async () => {
      const encryptedDetails = await getCookie("userDetails");
      const decryptedDetails = encryptedDetails
        ? await decryptData(encryptedDetails)
        : null;
      setUserData(decryptedDetails ? JSON.parse(decryptedDetails) : null);
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
  await logout();
};

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <div className="cursor-pointer flex items-center gap-x-3">
            <div className="text-end">
              <div className="text-xs font-semibold">
                {`${userData?.prefix ?? ""} ${userData?.first_name ?? ""} ${
                  userData?.last_name ?? ""
                } ${userData?.suffix ?? ""}`}
              </div>
              <div className="text-[10px]">
                {userData?.position
                  ? `${userData?.position}`
                  : `No position found`}
              </div>
            </div>
            <div>
              <img src={user_icon} className="h-10 w-10 rounded-lg" />
            </div>
          </div>
        </DropdownTrigger>
        <DropdownMenu
          itemClasses={{
            base: "!bg-transparent ",
          }}
          aria-label="Dropdown Variants"
          className="font-body"
        >
          {/* <DropdownItem textValue="Employee Self Service" onPress={()=> {navigate(`/employee-self-service`)}} key="employee-self-service">
            <div className="flex items-center gap-x-1">
              <div>
                <User2Icon size={17} />
              </div>
              <div className="text-xs">Employee Self Service</div>
            </div>
          </DropdownItem>
          <DropdownItem textValue="Settings" onPress={()=> {navigate(`/settings`)}} key="settings">
            <div className="flex items-center gap-x-1">
              <div>
                <CogIcon size={17} />
              </div>
              <div className="text-xs">Settings</div>
            </div>
          </DropdownItem> */}
          <DropdownItem textValue="Logout" onPress={handleLogout} key="logout">
            <div className="flex text-red-500 items-center gap-x-1">
              <div>
                <LogOutIcon size={17} />
              </div>
              <div className="text-xs">Logout</div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </>
  );
}

import Breadcrumb from "../../components/common/Breadcrumbs";
export default function Dashboard() {

  const items = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Dashboard" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center sm:mt-0">
        <div>
          <Breadcrumb title="Home" items={items} />
        </div>
      </div>
      <div className="relative h-[50vh] xl:flex items-center justify-center">
      
      </div>
    </div>
  );
}

import counter1 from "@/assets/images/counter/counter__1.png";
import counter2 from "@/assets/images/counter/counter__2.png";
import counter3 from "@/assets/images/counter/counter__3.png";
import CounterDashboard from "@/components/shared/dashboards/CounterDashboard";
import HeadingDashboard from "@/components/shared/headings/HeadingDashboard";

const CounterStudent = ({ stats }) => {
  const counts = [
    {
      name: "Enrolled Courses",
      image: counter1,
      data: stats.enrolled,
      symbol: "+",
    },
    {
      name: "Active Courses",
      image: counter2,
      data: stats.active,
      symbol: "+",
    },
    {
      name: "Complete Courses",
      image: counter3,
      data: stats.completed,
    },
  ];
  return (
    <CounterDashboard counts={counts}>
      <HeadingDashboard>Summery</HeadingDashboard>
    </CounterDashboard>
  );
};

export default CounterStudent;

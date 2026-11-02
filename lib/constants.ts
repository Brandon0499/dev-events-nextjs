export interface EventItem {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: EventItem[] = [
  {
    title: "AWS re:Invent 2026",
    image: "/images/event1.png",
    slug: "aws-reinvent-2026",
    location: "Las Vegas, NV, USA",
    date: "2026-11-30",
    time: "08:00 AM",
  },
  {
    title: "ETHDenver 2027",
    image: "/images/event2.png",
    slug: "ethdenver-2027",
    location: "Denver, CO, USA",
    date: "2027-02-25",
    time: "10:00 AM",
  },
  {
    title: "Microsoft Build 2027",
    image: "/images/event3.png",
    slug: "microsoft-build-2027",
    location: "Seattle, WA, USA",
    date: "2027-05-18",
    time: "09:00 AM",
  },
  {
    title: "Google I/O 2027",
    image: "/images/event4.png",
    slug: "google-io-2027",
    location: "Mountain View, CA, USA",
    date: "2027-05-19",
    time: "10:00 AM",
  },
  {
    title: "WWDC 2027",
    image: "/images/event5.png",
    slug: "wwdc-2027",
    location: "Cupertino, CA, USA",
    date: "2027-06-07",
    time: "10:00 AM",
  },
  {
    title: "React Summit 2027",
    image: "/images/event6.png",
    slug: "react-summit-2027",
    location: "Amsterdam, Netherlands",
    date: "2027-06-11",
    time: "09:30 AM",
  },
];

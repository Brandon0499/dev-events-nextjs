import { after } from "next/server";
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { posthogIntegrationLogger, posthogLogProvider, SeverityNumber } from "@/instrumentation";
import { events } from "@/lib/constants";

const Page = () => {
  after(async () => {
    posthogIntegrationLogger.emit({
      body: "Landing page rendering",
      severityNumber: SeverityNumber.INFO,
      attributes: { page: "home" },
    });
    posthogIntegrationLogger.emit({
      body: "Featured events prepared",
      severityNumber: SeverityNumber.INFO,
      attributes: { featured_event_count: events.length, page: "home" },
    });
    await posthogLogProvider.forceFlush();
  });

  return (
    <section>
        <h1 className="text-center">The Hub for Every Dev <br/> Event You Can&apos;t Miss</h1>
        <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>

        <ExploreBtn/>

        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>
          <ul className="events">
            {events.map((event)=> (
              <li key={event.title}>
                <EventCard {...event}></EventCard>
              </li>
            ))}
          </ul>
        </div>
    </section>
  )
}

export default Page

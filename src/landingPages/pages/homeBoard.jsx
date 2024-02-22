import React from "react";
import Fullcalender from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

const Home = () => {
    return (
        <div className="p-14 m-5">
            <Fullcalender
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay"
                }}
                events={[
                    { title: "event 1", date: "2021-09-01" },
                    { title: "event 2", date: "2021-09-02" }
                ]}
            />
        </div>
    )
}

export default Home;
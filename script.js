const eventsList = document.querySelector("#events");
const statusMessage = document.querySelector("#status");

function renderEvents(events) {
  eventsList.replaceChildren();

  for (const event of events) {
    const item = document.createElement("li");
    const heading = document.createElement("div");
    const link = document.createElement("a");
    const date = document.createElement("time");
    const description = document.createElement("p");
    const metadata = document.createElement("p");

    heading.className = "event-heading";
    link.href = event.repo.html_url;
    link.textContent = event.repo.full_name;
    date.dateTime = event.created_at;
    date.textContent = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium"
    }).format(new Date(event.created_at));
    description.className = "event-description";
    description.textContent = event.repo.description;
    metadata.className = "event-meta";
    metadata.textContent = event.repo.language;

    heading.append(link, date);
    item.append(heading, description, metadata);
    eventsList.append(item);
  }

  statusMessage.textContent = events.length
    ? `${events.length} repositories starred`
    : "No starred repositories yet.";
}

async function loadEvents() {
  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    statusMessage.textContent = "Could not load the starred repositories.";
    console.error("Failed to load events:", error);
  }
}

loadEvents();
const eventsList = document.querySelector("#events");
const statusMessage = document.querySelector("#status");

if (!eventsList || !statusMessage) {
  console.error("Required UI elements are missing for the starred repositories list.");
} else {
  loadEvents();
}

function getRepositoryDescription(repo) {
  return repo?.description?.trim() ? repo.description : "No description available.";
}

function getRepositoryLanguage(repo) {
  return repo?.language?.trim() ? repo.language : "Unknown language";
}

function renderEvents(events) {
  eventsList.replaceChildren();
  eventsList.setAttribute("aria-busy", "false");

  for (const event of events) {
    const item = document.createElement("li");
    const heading = document.createElement("div");
    const link = document.createElement("a");
    const date = document.createElement("time");
    const description = document.createElement("p");
    const metadata = document.createElement("p");
    const repo = event?.repo ?? {};

    heading.className = "event-heading";
    link.href = repo.html_url ?? "#";
    link.textContent = repo.full_name ?? "Unknown repository";
    link.rel = "noopener noreferrer";
    link.target = "_blank";
    date.dateTime = event.created_at ?? "";
    date.textContent = event.created_at
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium"
        }).format(new Date(event.created_at))
      : "Unknown date";
    description.className = "event-description";
    description.textContent = getRepositoryDescription(repo);
    metadata.className = "event-meta";
    metadata.textContent = getRepositoryLanguage(repo);

    heading.append(link, date);
    item.append(heading, description, metadata);
    eventsList.append(item);
  }

  statusMessage.textContent = events.length
    ? `${events.length} repositories starred`
    : "No starred repositories yet.";
}

async function loadEvents() {
  eventsList.setAttribute("aria-busy", "true");

  try {
    const response = await fetch("events.json");
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const events = await response.json();
    renderEvents(events);
  } catch (error) {
    eventsList.setAttribute("aria-busy", "false");
    statusMessage.textContent = "Could not load the starred repositories.";
    console.error("Failed to load events:", error);
  }
}

import React from "react";
import axios from "__mocks__/axios";

import { render, cleanup, waitForElement, waitForElementToBeRemoved, fireEvent, prettyDOM, getByText, getAllByTestId, getByAltText, getByPlaceholderText, queryByText } from "@testing-library/react";

import Application from "components/Application";
import debug from "debug";

afterEach(cleanup);

describe("Application", () => {
  it.only("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"))
      .then(() => {
        fireEvent.click(getByText("Tuesday"));
        expect(getByText("Leopold Silvers")).toBeInTheDocument();
      });
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    
    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));
    
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, /no spots remaining/i)).toBeInTheDocument();
  })

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, /deleting/i));

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  })

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")
      );

    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByText(appointment, "Save")).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Andres Murray"}
    });
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Andres Murray"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    
    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones"}
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Could not save appointment"));

    expect(getByAltText(appointment, "Close")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByPlaceholderText(appointment, "Enter Student Name")).toBeInTheDocument();
  })

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => 
      queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(getByText(appointment, /are you sure you would like to delete/i)).toBeInTheDocument();

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, /deleting/i));

    await waitForElement(() => getByText(appointment, "Could not delete appointment"));

    expect(getByAltText(appointment, "Close")).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, "Archie Cohen")).toBeInTheDocument();
  })
});

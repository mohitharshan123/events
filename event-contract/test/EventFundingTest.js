// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EventFunding", () => {
  let eventFunding;
  let owner;
  let eventId;
  let donator1;

  beforeEach(async () => {
    const EventFunding = await ethers.getContractFactory("EventFunding");
    eventFunding = await EventFunding.deploy();
    [owner, donator1, donator2] = await ethers.getSigners();

    await eventFunding.createEvent(
      owner.address,
      "Event Title",
      "Event Description",
      ethers.utils.parseEther("500"),
      1683557825,
      "image.png"
    );
    eventId = 0;
  });

  it("should create an event with the correct details", async () => {
    const eventDetails = await eventFunding.events(eventId);

    expect(eventDetails.id).to.equal(0);
    expect(eventDetails.owner).to.equal(owner.address);
    expect(eventDetails.title).to.equal("Event Title");
    expect(eventDetails.description).to.equal("Event Description");
    expect(eventDetails.target).to.equal(ethers.utils.parseEther("500"));
    expect(eventDetails.deadline).to.equal(1683557825);
    expect(eventDetails.amountCollected).to.equal(0);
    expect(eventDetails.image).to.equal("image.png");
  });

  it("should allow donating to an event and retrieve donator details", async () => {
    const donationAmount = 500;

    await eventFunding
      .connect(owner)
      .donateToEvent(eventId, { value: donationAmount });

    const [donators, donations] = await eventFunding.getDonators(eventId);

    expect(donators.length).to.equal(1);
    expect(donations.length).to.equal(1);
    expect(donators[0]).to.equal(owner.address);
    expect(donations[0]).to.equal(donationAmount);
  });

  it("should retrieve all events with the correct details", async () => {
    const allEvents = await eventFunding.getEvents();

    expect(allEvents.length).to.equal(1);

    const eventDetails = allEvents[0];

    expect(eventDetails.owner).to.equal(owner.address);
    expect(eventDetails.title).to.equal("Event Title");
    expect(eventDetails.description).to.equal("Event Description");
    expect(eventDetails.target).to.equal(ethers.utils.parseEther("500"));
    expect(eventDetails.deadline).to.equal(1683557825);
    expect(eventDetails.amountCollected).to.equal(0);
    expect(eventDetails.image).to.equal("image.png");
  });

  it("should retrieve my events with the correct details", async () => {
    await eventFunding.createEvent(
      donator1.address,
      "Event Title",
      "Event Description",
      ethers.utils.parseEther("500"),
      1683557825,
      "image.png"
    );
    const donator1Events = await eventFunding.getMyEvents(donator1.address);
    const ownerEvents = await eventFunding.getMyEvents(owner.address);
    expect(donator1Events.length).to.equal(1);
    expect(ownerEvents.length).to.equal(1);
  });

  it("should retrieve all donators with the correct details", async () => {
    await eventFunding
      .connect(donator1)
      .donateToEvent(eventId, { value: ethers.utils.parseEther("200") });
    const [donators, donations] = await eventFunding.getDonators(eventId);
    expect(donators.length).to.equal(1);
    expect(donations.length).to.equal(1);
    expect(donators[0]).to.equal(donator1.address);
    expect(donations[0]).to.equal(ethers.utils.parseEther("200"));
  });

  it("should return if user is a donator correctly", async () => {
    await eventFunding
      .connect(donator1)
      .donateToEvent(eventId, { value: ethers.utils.parseEther("200") });
    const isDonator1ADonator = await eventFunding.isDonator(
      eventId,
      donator1.address
    );
    const isOwnerADonator = await eventFunding.isDonator(
      eventId,
      owner.address
    );

    expect(isDonator1ADonator).to.equal(true);
    expect(isOwnerADonator).to.equal(false);
  });

  it("should refund donators if deadline passed and target not reached", async function () {
    await eventFunding
      .connect(donator1)
      .donateToEvent(eventId, { value: ethers.utils.parseEther("200") });
    const balanceBeforeRefund = await ethers.provider.getBalance(
      donator1.address
    );

    const tx = await eventFunding.processRefund(eventId, donator1.address, {
      value: ethers.utils.parseEther("200"),
    });
    const receipt = await tx.wait();
    const gasSpent = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    const originalBalance = ethers.utils.parseEther("200");
    const refundAmount = originalBalance.sub(gasSpent);
    const balanceAfterRefund = await ethers.provider.getBalance(
      donator1.address
    );
    const marginOfError = ethers.utils.parseEther("0.001"); // set margin of error to 0.001 ether
    expect(balanceAfterRefund).to.not.equal(balanceBeforeRefund);
    expect(
      ethers.utils.parseUnits(
        ethers.utils.formatUnits(balanceAfterRefund, 18),
        18
      )
    ).to.be.closeTo(
      ethers.utils.parseUnits(
        ethers.utils.formatUnits(balanceBeforeRefund.add(refundAmount), 18),
        18
      ),
      marginOfError
    );
    const event = await eventFunding.events(eventId);
    expect(event.refunded).to.be.true;
    expect(event.amountCollected).to.equal(0);
  });
});

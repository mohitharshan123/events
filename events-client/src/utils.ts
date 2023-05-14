import { EventToFund } from './types';
import web3 from 'web3-utils';

export const parseEvents = (events: Array<any>): Array<EventToFund> =>
  events?.map(event => {
    const [
      id,
      owner,
      title,
      description,
      target,
      deadline,
      amountCollected,
      imageUrl,
      donators,
      donations,
      refunded,
    ] = event;
    return {
      id: parseInt(id, 16).toString(),
      owner,
      title,
      description,
      target,
      deadline: new Date(parseInt(deadline, 16)).toString(),
      amountCollected: parseInt(amountCollected, 16),
      imageUrl,
      donators: donators,
      donations: donations.toString(),
      refunded,
    };
  });

export const toEther = (amount: number) =>
  web3.fromWei(Math.round(amount).toString(), 'ether');

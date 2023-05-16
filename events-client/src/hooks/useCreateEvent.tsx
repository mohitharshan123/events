import { useAddress } from '@thirdweb-dev/react-native';
import { useForm } from 'react-hook-form';
import { EVENT_FORM_INITIAL_VALUES, FUNCTIONS } from '../constants';
import { CreateEventProp, Screens } from '../types';

const useCreateEvent = ({ navigation }: CreateEventProp) => {
  const address = useAddress();

  const {
    control,
    formState: { errors },
    getValues,
    setValue,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: EVENT_FORM_INITIAL_VALUES,
  });
  const { title, description, target } = getValues();

  const createEvent = async (contract: any) => {
    await contract.call(FUNCTIONS.create_event, [
      address,
      title,
      description,
      target,
      deadline,
      imageUrl,
    ]);
    navigation.navigate(Screens.Events);
  };

  const deadline = watch('deadline');
  const imageUrl = watch('imageUrl');

  return {
    deadline,
    imageUrl,
    title,
    description,
    target,
    control,
    errors,
    setValue,
    createEvent,
    handleSubmit,
  };
};

export default useCreateEvent;

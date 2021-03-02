import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';

import find from 'lodash/find';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';

import getSelectStyle from './../../helpers/getSelectStyle';
import getDefaultSystems from './../../helpers/getDefaultSystems';
import { TabItem } from './../Tabs';
import Input from './../Input';
import { PlayerSkillSidebar, PlayerSkillFormControl, PlayerSkillFormLabel, PlayerSkillFormSend, PlayerSkillFormHelper } from './PlayerSkill.styled';
interface Props {
  playerSkill: any;
  setPlayerSkill(data: any): any;
  afterSave(): void;
}

const PlayerSkill = (props: Props) => {
  const { control, register, handleSubmit } = useForm();
  const { playerSkill, setPlayerSkill, afterSave } = props;
  const [formValues, setFormValues] = useState<any>();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const accountingLevelOptions: any = [
    { value: 5, label: 'Level 0 (5%)' },
    { value: 4.45, label: 'Level 1 (4.45%)' },
    { value: 3.9, label: 'Level 2 (3.9%)' },
    { value: 3.35, label: 'Level 3 (3.35%)' },
    { value: 2.8, label: 'Level 4 (2.8%)' },
    { value: 2.25, label: 'Level 5 (2.25%)' },
  ];
  const stationOptions: any = getDefaultSystems();
  const sidebarRef = useRef<any>(null);

  useEffect(() => {
    if (playerSkill) {
      setFormValues({
        accountingLevel: playerSkill.accountingLevel
          ? find(accountingLevelOptions, { value: playerSkill.accountingLevel })
          : accountingLevelOptions[0],
        brokerFee: playerSkill.brokerFee ? playerSkill.brokerFee : 5,
        minimumMargin: playerSkill.minimumMargin ? playerSkill.minimumMargin : 10,
        minimumBenefit: playerSkill.minimumBenefit ? playerSkill.minimumBenefit : 500000,
        gapTolerance: playerSkill.gapTolerance ? playerSkill.gapTolerance : 5,
        favoriteStation: playerSkill.favoriteStation ? playerSkill.favoriteStation : stationOptions[0],
      });
    }
  }, [playerSkill]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', keydownListener);
      document.addEventListener('mousedown', clickOutside);
      document.addEventListener('touchstart', clickOutside);

      return () => {
        document.removeEventListener('keydown', keydownListener);
        document.removeEventListener('mousedown', clickOutside);
        document.removeEventListener('touchstart', clickOutside);
      };
    }
  }, [isOpen]);

  function keydownListener(e: any) {
    const { keyCode, metaKey, ctrlKey } = e;
    if (isOpen && keyCode === 27) {
      setIsOpen(false);
      return;
    }

    console.log({ mac: window.navigator.platform.match('Mac'), metaKey, ctrlKey, keyCode });
    if ((window.navigator.platform.match('Mac') ? metaKey : ctrlKey) && keyCode == 83) {
      e.preventDefault();
      handleSubmit(onSubmit);
      return;
    }
  }

  function clickOutside(e: any) {
    if (!sidebarRef.current || sidebarRef.current.contains(e.target)) {
      return;
    }
    if (isOpen) {
      setIsOpen(false);
    }
  }

  function openPlayerSkill(e: any) {
    e.preventDefault();
    setIsOpen((prev: any) => !prev);
  }

  const onSubmit = (data: any) => {
    const { accountingLevel, brokerFee, favoriteStation, gapTolerance, minimumBenefit, minimumMargin } = data;
    setPlayerSkill({
      accountingLevel: accountingLevel.value,
      brokerFee: parseFloat(brokerFee),
      gapTolerance: parseInt(gapTolerance),
      minimumMargin: parseInt(minimumMargin),
      minimumBenefit: parseInt(minimumBenefit),
      favoriteStation,
    });
    afterSave();
    toast.success('Configuration saved', {
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setIsOpen((prev: any) => !prev);
  };

  return (
    <>
      <TabItem isActive={isOpen} onClick={openPlayerSkill} style={{ marginTop: 'auto' }}>
        <img src="img/augmentations.png" className="main" />
        <img src="img/augmentations.png" className="glow" />
      </TabItem>
      <PlayerSkillSidebar isOpen={isOpen} ref={sidebarRef}>
        {formValues && !isEmpty(formValues) ? (
          <>
            <PlayerSkillFormControl>
              <PlayerSkillFormLabel>Favorite Station</PlayerSkillFormLabel>

              <Controller
                name="favoriteStation"
                placeholder="Select favorite station"
                styles={getSelectStyle}
                control={control}
                options={stationOptions}
                defaultValue={playerSkill.favoriteStation ? playerSkill.favoriteStation : stationOptions[0]}
                value={formValues.favoriteStation}
                as={Select}
              />
              <PlayerSkillFormHelper>This will set your favorite market place</PlayerSkillFormHelper>
            </PlayerSkillFormControl>

            <PlayerSkillFormControl>
              <PlayerSkillFormLabel>Skill Accounting level</PlayerSkillFormLabel>
              <Controller
                name="accountingLevel"
                placeholder="Select accounting level"
                styles={getSelectStyle}
                control={control}
                options={accountingLevelOptions}
                defaultValue={
                  playerSkill.accountingLevel ? find(accountingLevelOptions, { value: playerSkill.accountingLevel }) : accountingLevelOptions[0]
                }
                value={formValues.accountingLevel}
                as={Select}
              />
            </PlayerSkillFormControl>

            <PlayerSkillFormControl>
              <PlayerSkillFormLabel>Broker fee (in percent)</PlayerSkillFormLabel>
              <Input
                name="brokerFee"
                ref={register}
                defaultValue={formValues.brokerFee}
                type="number"
                step=".01"
                placeholder="Broker fee (in percent)"
              />
              <PlayerSkillFormHelper>
                More information about{' '}
                <a href="https://support.eveonline.com/hc/en-us/articles/203218962-Broker-Fee-and-Sales-Tax" target="_blank">
                  Broker fee
                </a>{' '}
              </PlayerSkillFormHelper>
            </PlayerSkillFormControl>

            <PlayerSkillFormControl>
              <PlayerSkillFormLabel>GAP tolerance (in percent)</PlayerSkillFormLabel>
              <Input
                name="gapTolerance"
                ref={register}
                defaultValue={formValues.gapTolerance}
                type="number"
                step=".01"
                placeholder="GAP tolerance (in percent)"
              />
              <PlayerSkillFormHelper>GAP tolerance between first sell order and first buy order</PlayerSkillFormHelper>
            </PlayerSkillFormControl>

            <PlayerSkillFormControl>
              <PlayerSkillFormLabel>Minimum margin (in percent)</PlayerSkillFormLabel>
              <Input
                name="minimumMargin"
                ref={register}
                defaultValue={formValues.minimumMargin}
                type="number"
                placeholder="Select minimum margin (in percent)"
              />
              <PlayerSkillFormHelper>Minimum gap in percent between first sell order and second one</PlayerSkillFormHelper>
            </PlayerSkillFormControl>

            <PlayerSkillFormControl>
              <PlayerSkillFormLabel>Minimum benefit (in ISK)</PlayerSkillFormLabel>
              <Input
                name="minimumBenefit"
                ref={register}
                defaultValue={formValues.minimumBenefit}
                type="number"
                step="1000"
                min="0"
                placeholder="Minimum benefit (in ISK)"
              />
              <PlayerSkillFormHelper>Minimum total benefit in ISK</PlayerSkillFormHelper>
            </PlayerSkillFormControl>

            <PlayerSkillFormSend type="button" onClick={handleSubmit(onSubmit)}>
              Save
            </PlayerSkillFormSend>
          </>
        ) : null}
      </PlayerSkillSidebar>
    </>
  );
};

export default PlayerSkill;

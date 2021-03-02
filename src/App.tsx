import React, { useState } from 'react';
import { ToastContainer, Slide } from 'react-toastify';
import Modal from 'react-modal';
import EveOnlineAPI from './model/eveOnlineApi';

import MainWrapper from './components/MainWrapper';
import WatchList from './components/WatchList';
import PlayerSkill from './components/PlayerSkill';
import ItemDataCard from './components/ItemDataCard';
import Nav from './components/Nav';
import { Tabs, TabItem, TabPanel, TabPanels } from './components/Tabs';

import getData from './helpers/getData';
import setData from './helpers/setData';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [playerSkill, setPlayerSkill] = useState(getData('config', true));
  const [currentDetails, setCurrentDetails] = useState<any>(null);
  const [showModal, setShowModal] = useState<any>(false);
  const [showGraph, setShowGraph] = useState<any>(false);

  Modal.setAppElement('#root');

  function savePlayerSkill(data: any) {
    setData('config', data, true);
    setPlayerSkill(data);
  }

  function changeTab(index: number) {
    if (currentTab !== index) {
      setCurrentTab(index);
    }
  }

  function showDetailsModal(item: any) {
    setCurrentDetails(item);
    toggleModal();
  }

  function toggleModal() {
    setShowModal((prev: boolean) => !prev);
  }

  return (
    <MainWrapper>
      <Nav>
        <Tabs>
          <TabItem isActive={currentTab === 0} onClick={() => changeTab(0)}>
            <img src="/img/market.png" className="main" />
            <img src="/img/market.png" className="glow" />
          </TabItem>
          {/* <TabItem isActive={currentTab === 1} onClick={() => changeTab(1)}>
            <img src="/img/wallet.png" className="main" />
            <img src="/img/wallet.png" className="glow" />
          </TabItem> */}
        </Tabs>
        <PlayerSkill setPlayerSkill={savePlayerSkill} playerSkill={playerSkill} />
      </Nav>

      <TabPanels>
        <TabPanel isActive={currentTab === 0}>
          <WatchList playerSkill={playerSkill} showDetailsModal={showDetailsModal} />
        </TabPanel>
        <TabPanel isActive={currentTab === 1}>Coucou</TabPanel>
      </TabPanels>

      <Modal
        isOpen={showModal}
        className="QuickMarket"
        overlayClassName="QuickMarket"
        onRequestClose={toggleModal}
        onAfterOpen={() => setTimeout(() => setShowGraph(true), 300)}
        onAfterClose={() => setShowGraph(false)}
      >
        {currentDetails ? <ItemDataCard currentItem={currentDetails} showGraph={showGraph} /> : null}
      </Modal>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </MainWrapper>
  );
};

export default App;

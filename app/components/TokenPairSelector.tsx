/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {useState, useEffect} from 'react';
import styles from '../styles/tokenpairselector.module.scss';
import {BsArrowDownCircle} from 'react-icons/bs';
import {AiOutlineDown} from 'react-icons/ai';
import coin from '../assets/icons/eth.webp';
import Image from 'next/image';
import {CiSettings} from 'react-icons/ci';
import Dropdown from './Dropdown';
import detectEthereumProvider from '@metamask/detect-provider';

const TokenPairSelector = () => {
  const [visible, setVisible] = useState(false);
  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = {accounts: [], balance: '', chainId: ''}; /* Updated */
  const [wallet, setWallet] = useState(initialState);

  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId: any) => {
      /* New */
      setWallet((wallet) => ({...wallet, chainId})); /* New */
    }; /* New */

    const getProvider = async () => {
      const provider = await detectEthereumProvider({silent: true});
      setHasProvider(Boolean(provider));

      if (provider) {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts',
        });
        refreshAccounts(accounts);
        window.ethereum.on('accountsChanged', refreshAccounts);
        window.ethereum.on('chainChanged', refreshChain); /* New */
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener('accountsChanged', refreshAccounts);
      window.ethereum?.removeListener('chainChanged', refreshChain); /* New */
    };
  }, []);

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum?.request({
        method: 'eth_getBalance',
        params: [accounts[0], 'latest'],
      }),
    );
    const chainId = await window.ethereum!.request({
      method: 'eth_chainId',
    });
    setWallet({accounts, balance, chainId}); /* Updated */
  };

  const handleConnect = async () => {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    updateWallet(accounts);
  };

  function formatChainAsNum(chainId: string): React.ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <div className={styles.card}>
      <div>Malik:</div>
      {wallet.accounts.length > 0 && (
        <>
          {' '}
          {/* New */}
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div> {/* New */}
          <div>Hex ChainId: {wallet.chainId}</div> {/* New */}
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>{' '}
          <div>Malik:</div>
          {/* New */}
        </>
      )}
      {visible && <Dropdown visible={visible} setVisible={setVisible} />}
      <div className={styles.cardTopDiv}>
        <div className={styles.rowDiv}>
          <button className={styles.marketButtonStyle}>Market</button>
          <button className={styles.limitButtonStyle}>Limit</button>
        </div>
        <CiSettings size={24} color="#25272b" />
      </div>

      <div className={styles.cardMiddleDiv}>
        <div className={styles.fromTokenSelectContainer}>
          <div className={styles.fromTokenSelectContainerTop}>
            <p className={styles.titleStyle}>Pay with</p>
            <p className={styles.balanceStyle}>
              Balance: {wallet.balance ? wallet.balance : ''}
            </p>
          </div>

          <div className={styles.fromTokenSelectContainerMiddle}>
            <div
              className={styles.chooseTokenDiv}
              onClick={() => setVisible(!visible)}
            >
              <Image src={coin} alt="coin" style={{width: 25, height: 25}} />
              <p className={styles.fromText}>USDT</p>
              <AiOutlineDown size={12} style={{marginRight: 5}} />
            </div>
            <div
              className={
                styles.fromTokenSelectContainerMiddleInnerLeftContainer
              }
            >
              <p className={styles.CircleButton}>Max</p>
              <p className={styles.CircleButton}>50%</p>
              {/* <p className={styles.CircleButton}>Clear</p> */}
            </div>
          </div>

          <div className={styles.fromTokenSelectContainerBottom}>
            <input
              type="number"
              placeholder="0.0"
              className={styles.inputStyle}
            />
            <p className={styles.balanceStyle}>0.34345</p>
          </div>

          <div className={styles.dividerDiv}>
            <BsArrowDownCircle className={styles.circleDiv} color="black" />
          </div>
        </div>
        <div className={styles.fromTokenSelectContainer}>
          <div className={styles.fromTokenSelectContainerTop}>
            <p className={styles.titleStyle}>You recieve</p>
            <p className={styles.balanceStyle}>Balance: 0.234</p>
          </div>

          <div className={styles.fromTokenSelectContainerMiddle}>
            <div
              className={styles.chooseTokenDiv}
              onClick={() => setVisible(!visible)}
            >
              <Image src={coin} alt="coin" style={{width: 25, height: 25}} />
              <p className={styles.FromText}>USDT</p>
              <AiOutlineDown size={12} style={{marginRight: 5}} />
            </div>
          </div>

          <div className={styles.fromTokenSelectContainerBottom}>
            <input
              type="number"
              placeholder="0.0"
              className={styles.inputStyle}
            />
            <p className={styles.balanceStyle}>0.34345</p>
          </div>
        </div>
        <div className={styles.btndiv}>
          <button className={styles.connectWalletBtn} onClick={handleConnect}>
            {window.ethereum?.isMetaMask && wallet.accounts.length < 1
              ? 'Connect Wallet'
              : 'Swap'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPairSelector;
function formatBalance(arg0: any) {
  throw new Error('Function not implemented.');
}

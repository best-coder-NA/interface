import React, { useCallback, useState } from 'react'
import { AutoColumn } from '../../components/Column'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { JSBI, Token  } from '@pangolindex/sdk'
import { RouteComponentProps } from 'react-router-dom'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useCurrency } from '../../hooks/Tokens'
import { useWalletModalToggle } from '../../state/application/hooks'
import { TYPE } from '../../theme'

import { RowBetween } from '../../components/Row'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { ButtonPrimary } from '../../components/Button'
import StakingModal from '../../components/earn/StakingModal'
import { useStakingInfo } from '../../state/stake/snowglobehooks'
import UnstakingModal from '../../components/earn/UnstakingModal'
import ClaimRewardModal from '../../components/earn/ClaimRewardModal'
import { useTokenBalance } from '../../state/wallet/hooks'
import { useActiveWeb3React } from '../../hooks'
import { useColor } from '../../hooks/useColor'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { currencyId } from '../../utils/currencyId'
import { usePair } from '../../data/Reserves'
// import useUSDCPrice from '../../utils/useUSDCPrice'

const PageWrapper = styled(AutoColumn)`
   max-width: 640px;
   width: 100%;
 `

const PositionInfo = styled(AutoColumn) <{ dim: any }>`
   position: relative;
   max-width: 640px;
   width: 100%;
   opacity: ${({ dim }) => (dim ? 0.6 : 1)};
 `

const BottomSection = styled(AutoColumn)`
   border-radius: 12px;
   width: 100%;
   position: relative;
 `

const StyledDataCard = styled(DataCard) <{ bgColor?: any; showBackground?: any }>`
   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #1e1a31 0%, #3d51a5 100%);
   z-index: 2;
   box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
   background: ${({ theme, bgColor, showBackground }) =>
		`radial-gradient(91.85% 100% at 1.84% 0%, ${bgColor} 0%,  ${showBackground ? theme.black : theme.bg5} 100%) `};
 `


const VoteCard = styled(DataCard)`
   background: radial-gradient(76.02% 75.41% at 1.84% 0%, #27ae60 0%, #000000 100%);
   overflow: hidden;
 `

const DataRow = styled(RowBetween)`
   justify-content: center;
   gap: 12px;

   ${({ theme }) => theme.mediaWidth.upToSmall`
     flex-direction: column;
     gap: 12px;
   `};
 `

export default function SnowGlobeManage({
	match: {
		params: { currencyIdA, currencyIdB }
	}
}: RouteComponentProps<{ currencyIdA: string; currencyIdB: string }>) {
	const { account, chainId } = useActiveWeb3React()

	// get currencies and pair
	const [currencyA, currencyB] = [useCurrency(currencyIdA), useCurrency(currencyIdB)]
	const tokenA = wrappedCurrency(currencyA ?? undefined, chainId)
	const tokenB = wrappedCurrency(currencyB ?? undefined, chainId)

	const [, stakingTokenPair] = usePair(tokenA, tokenB)
	const stakingInfo = useStakingInfo(stakingTokenPair)?.[0]


	// let valueOfTotalStakedAmountInUSDC: CurrencyAmount | undefined
	let backgroundColor: string
	let token: Token | undefined



	// get the color of the token
	backgroundColor = useColor(token)

	// const USDPrice = useUSDCPrice(usdToken)
	// valueOfTotalStakedAmountInUSDC =
	// 		valueOfTotalStakedAmountInWavax && USDPrice?.quote(valueOfTotalStakedAmountInWavax)

	// detect existing unstaked LP position to show add button if none found
	const userLiquidityUnstaked = useTokenBalance(account ?? undefined, stakingInfo?.stakedAmount?.token)
	const showAddLiquidityButton = false;

	// toggle for staking modal and unstaking modal
	const [showStakingModal, setShowStakingModal] = useState(false)
	const [showUnstakingModal, setShowUnstakingModal] = useState(false)
	const [showClaimRewardModal, setShowClaimRewardModal] = useState(false)

	// fade cards if nothing staked or nothing earned yet
	const disableTop = !stakingInfo?.stakedAmount || stakingInfo.stakedAmount.equalTo(JSBI.BigInt(0))


	// get WAVAX value of staked LP tokens

	// let valueOfTotalStakedAmountInWAVAX: TokenAmount | undefined
	// if (totalSupplyOfStakingToken && stakingTokenPair && stakingInfo && WAVAX) {
	// 	// take the total amount of LP tokens staked, multiply by AVAX value of all LP tokens, divide by all LP tokens
	// 	valueOfTotalStakedAmountInWAVAX = new TokenAmount(
	// 		WAVAX,
	// 		JSBI.divide(
	// 			JSBI.multiply(
	// 				JSBI.multiply(stakingInfo.totalStakedAmount.raw, stakingTokenPair.reserveOf(WAVAX).raw),
	// 				JSBI.BigInt(2) // this is b/c the value of LP shares are ~double the value of the WAVAX they entitle owner to
	// 			),
	// 			totalSupplyOfStakingToken.raw
	// 		)
	// 	)
	// }


	const toggleWalletModal = useWalletModalToggle()

	const handleDepositClick = useCallback(() => {
		if (account) {
			setShowStakingModal(true)
		} else {
			toggleWalletModal()
		}
	}, [account, toggleWalletModal])

	return (
		<PageWrapper gap="lg" justify="center">
			<RowBetween style={{ gap: '24px' }}>
				<TYPE.mediumHeader style={{ margin: 0 }}>
					{currencyA?.symbol}-{currencyB?.symbol} Snowglobe ❄️
         </TYPE.mediumHeader>
				<DoubleCurrencyLogo currency0={currencyA ?? undefined} currency1={currencyB ?? undefined} size={24} />
			</RowBetween>

			{showAddLiquidityButton && (
				<VoteCard>
					<CardBGImage />
					<CardNoise />
					<CardSection>
						<AutoColumn gap="md">
							<RowBetween>
								<TYPE.white fontWeight={600}>Step x. Get Pangolin Liquidity tokens (PGL)</TYPE.white>
							</RowBetween>
							<RowBetween style={{ marginBottom: '1rem' }}>
								<TYPE.white fontSize={14}>
									{`PGL tokens are required. Once you've added liquidity to the ${currencyA?.symbol}-${currencyB?.symbol} pool you can stake your liquidity tokens on this page.`}
								</TYPE.white>
							</RowBetween>
							<ButtonPrimary
								padding="8px"
								borderRadius="8px"
								width={'fit-content'}
								as={Link}
								to={`/add/${currencyA && currencyId(currencyA)}/${currencyB && currencyId(currencyB)}`}
							>
								{`Add ${currencyA?.symbol}-${currencyB?.symbol} liquidity`}
							</ButtonPrimary>
						</AutoColumn>
					</CardSection>
					<CardBGImage />
					<CardNoise />
				</VoteCard>
			)}

			{stakingInfo && (
				<>
					<StakingModal
						isOpen={showStakingModal}
						onDismiss={() => setShowStakingModal(false)}
						stakingInfo={stakingInfo}
						userLiquidityUnstaked={userLiquidityUnstaked}
					/>
					<UnstakingModal
						isOpen={showUnstakingModal}
						onDismiss={() => setShowUnstakingModal(false)}
						stakingInfo={stakingInfo}
					/>
					<ClaimRewardModal
						isOpen={showClaimRewardModal}
						onDismiss={() => setShowClaimRewardModal(false)}
						stakingInfo={stakingInfo}
					/>
				</>
			)}

			<PositionInfo gap="lg" justify="center" dim={showAddLiquidityButton}>
				<BottomSection gap="lg" justify="center">
					<StyledDataCard disabled={disableTop} bgColor={backgroundColor} showBackground={!showAddLiquidityButton}>
						<CardSection>
							<CardBGImage desaturate />
							<CardNoise />
							<AutoColumn gap="md">
								<RowBetween>
									<TYPE.white fontWeight={600}>Your liquidity deposits</TYPE.white>
								</RowBetween>
								<RowBetween style={{ alignItems: 'baseline' }}>
									<TYPE.white fontSize={36} fontWeight={600}>
										{stakingInfo?.stakedAmount?.toSignificant(6) ?? '-'}
									</TYPE.white>
									<TYPE.white>
										PGL {currencyA?.symbol}-{currencyB?.symbol}
									</TYPE.white>
								</RowBetween>
							</AutoColumn>
						</CardSection>
					</StyledDataCard>
				</BottomSection>

				{!showAddLiquidityButton && (
					<DataRow style={{ marginBottom: '1rem' }}>
						<ButtonPrimary padding="8px" borderRadius="8px" width="160px" onClick={handleDepositClick}>
							{stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) ? 'Deposit' : 'Deposit PGL Tokens'}
						</ButtonPrimary>

						{stakingInfo?.stakedAmount?.greaterThan(JSBI.BigInt(0)) && (
							<>
								<ButtonPrimary
									padding="8px"
									borderRadius="8px"
									width="160px"
									onClick={() => setShowUnstakingModal(true)}
								>
									Withdraw
                 </ButtonPrimary>
							</>
						)}
					</DataRow>
				)}
				{!userLiquidityUnstaked ? null : userLiquidityUnstaked.equalTo('0') ? null : (
					<TYPE.main>{userLiquidityUnstaked.toSignificant(6)} PGL tokens available</TYPE.main>
				)}
			</PositionInfo>
		</PageWrapper>
	)
}
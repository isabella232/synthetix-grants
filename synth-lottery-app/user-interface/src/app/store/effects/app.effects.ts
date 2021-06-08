
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { CONTRACT_ADDRESS } from 'app/app.constants';
import { BackendService } from 'app/service/backend.service';
import { ContractService } from 'app/service/contract.service';
import { from, Observable, of, timer } from 'rxjs';
import { catchError, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { loadLotteryDraws, loadLotteryDrawsFailure, loadLotteryDrawsSuccess } from '../reducers/lottery-draws.reducer';
import { approveContract, lotteryLoadData, lotteryDataLoadSuccess, lotteryDataLoadFailure, 
  loadCurrentContractAllowance, loadCurrentContractAllowanceSuccess, 
  loadCurrentContractAllowanceFailure, setHasWinnings, checkForWinningsFailure, checkForWinnings, loadUserBalance, loadUserBalanceSuccess, loadUserBalanceFailure } from '../reducers/lottery.reducer';
import { loadUserTickets, loadUserTicketsFailure, loadUserTicketsSuccess } from '../reducers/user-ticket.reducer';
import { logoutUser } from '../reducers/user.reducer';
import { getAccountAddress } from '../selectors/users.selectors';
import Web3 from 'web3';
import { CommonUtil } from 'app/common.util';



@Injectable()
export class AppEffects {

  private checkHasWinningsInitialized = false;

  constructor(private actions$: Actions,
              private store: Store,
              private contractService: ContractService,
              private backendService: BackendService) { }

              // TODO :Do we need this?
  // ApproveContract$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(approveContract),
  //     withLatestFrom(getAccountAddress),
  //     mergeMap(([_, accountAddress]) => {
  //       const approveAmount = 100;
  //       const approveP$ = this.contractService.getUsdContract()
  //         .methods
  //         .approve(CONTRACT_ADDRESS, approveAmount)
  //         .send({from: accountAddress});
  //       return from(approveP$);
  //     }),
  //   ),
  //   { dispatch: false }
  // );

  LoadDataEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(lotteryLoadData),
      mergeMap((_) => {
        const loadDataValuesP$ = this.contractService.getLotteryContract().methods
          .getDetails()
          .call();
        return from(loadDataValuesP$);
      }),
      map((result: any) => {
        const data = {
          nextDrawTimestamp: Number(result.timestamp),
          drawPool: Number(CommonUtil.getNumber(result.amount)),
          drawNumber: Number(result.currentDrawNumber),
          ticketPrice: Number(CommonUtil.getNumber(result.ticketPrice))
        };
        return lotteryDataLoadSuccess(data);
      }),
      catchError((error) => {
        console.log(error);
        return of(lotteryDataLoadFailure());
      })
    )
  );

  LoadCurrentContractAllowance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentContractAllowance),
      mergeMap((data) => {
        const loadDataValuesP$ = this.contractService.getUsdContract().methods
          .allowance(data.accountAddress, CONTRACT_ADDRESS)
          .call();
        return from(loadDataValuesP$);
      }),
      map((result: any) => {
        const data = { contractAllowance: CommonUtil.getNumber(result) };
        return loadCurrentContractAllowanceSuccess(data);
      }),
      catchError((error) => {
        console.log(error);
        return of(loadCurrentContractAllowanceFailure());
      })
    )
  );

  LoadUserBalance$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserBalance),
      mergeMap((data) => {
        const promise$ = this.contractService.getUsdContract()
          .methods
          .balanceOf(data.accountAddress)
          .call();
        return from(promise$);
      }),
      map((result: any) => {
        const data = { userBalance: CommonUtil.getNumber(result) };
        return loadUserBalanceSuccess(data);
      }),
      catchError((error) => {
        console.log(error);
        return of(loadUserBalanceFailure());
      })
    )
  );

  LoadUserTickets$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserTickets),
      withLatestFrom(this.store.select(getAccountAddress)),
      switchMap(([_, accountAddress]) => {
        if (!accountAddress) {
          return of([]);
        }
        const loadDataValuesP$ = this.contractService.getLotteryContract()
          .methods
          .getUserTickets(accountAddress)
          .call();
        return from(loadDataValuesP$);
      }),
      map((tickets: any[]) => {
        const data = { tickets };
        return loadUserTicketsSuccess(data);
      }),
      catchError((_error) => {
        console.log(_error);
        return of(loadUserTicketsFailure());
      })
    )
  );

  CheckHasWinnings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkForWinnings),
      filter(() => !this.checkHasWinningsInitialized),
      switchMap((_) => {
        this.checkHasWinningsInitialized = true;
        return timer(0, 60000).pipe(
          withLatestFrom(this.store.select(getAccountAddress)),
          filter(([_timerData, accountAddress]) => !!accountAddress),
          mergeMap(([_timerData, accountAddress]) => {
            const loadDataValuesP$ = this.contractService.getLotteryContract()
              .methods
              .balanceOf(accountAddress)
              .call();
            return from(loadDataValuesP$).pipe(
              switchMap((balance: any) => {
                const winningsP$ = this.contractService.getLotteryContract()
                  .methods
                  .hasUnclaimedWinnings(accountAddress)
                  .call();
                return from(winningsP$);
              }),
              filter((results: any) => results.userHasUnclaimedWinnings),
              map((_result: any) => {
                return setHasWinnings();
              }),
              catchError((_error) => {
                console.log(_error);
                return of(checkForWinningsFailure());
              })
            );
          }),
        );
      }),
    )
  );

  LoadLotteryDraws$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLotteryDraws),
      switchMap(_ => this.backendService.getLotteryDraws()),
      map((result: any[]) => {
        return loadLotteryDrawsSuccess({ draws: result });
      }),
      catchError((_error) => {
        console.log(_error);
        return of(loadLotteryDrawsFailure());
      })
    )
  );

  Logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      tap(_ => {
        this.contractService.clearProvider();
      })
    ),
    { dispatch: false }
  );

}

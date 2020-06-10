import { Component, OnInit } from '@angular/core';
import { Column } from '../../../shared/models/column.model';
import { BoardService } from '../../../shared/services/board.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ColumnService } from '../../../shared/services/column.service';
import { CardService } from '../../../shared/services/card.service';
import { Board } from '../../../shared/models/board.model';
import { ModalController } from '@ionic/angular';
import { CreateColumnModalComponent } from '../create-column-modal/create-column-modal.component';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.scss'],
})
export class ColumnsListComponent implements OnInit {
  public columns: Column[] = [];
  public board: Board;
  public isBoardLoading = true;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private boardService: BoardService,
              private modalController: ModalController,
              private columnService: ColumnService,
              private cardService: CardService) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!params.boardId) {
        this.router.navigate(['boards']);
      }

      this.getBoardDetail(params.boardId);

    });
  }

  async createColumn() {
    const modal = await this.modalController.create({
      component: CreateColumnModalComponent,
      componentProps: {
        boardId: this.board._id,
      }
    });

    modal.onWillDismiss().then((res) => {
      if (res && res.data) {
        this.columns = [...this.columns, res.data.createdColumn];
      }
    });

    return await modal.present();
  }

  private getBoardDetail(boardId): void {
    this.boardService.getBoardDetail(boardId).subscribe((response: Board) => {
      if (response) {
        this.board = response;
        this.columns = [...response.columns];
        this.boardService.setActiveBoard(response);
      } else {
        this.router.navigate(['boards']);
      }

      this.isBoardLoading = false;
    }, (error) => {
      this.router.navigate(['boards']);
    });
  }

}

import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Planning } from '@app/models/planning.model';
import { AuthuserService } from '@app/services/authuser.service';
import { PlanningService } from '@app/services/planning.service';

@Component({
  selector: 'app-planning-detail',
  templateUrl: './planning-detail.component.html',
  styleUrls: ['./planning-detail.component.css']
})
export class PlanningDetailComponent implements OnInit {
  planning: Planning | null = null;
  loading = true;
  error: string | null = null;
  isCreator = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    private planningService: PlanningService,
    public authService: AuthuserService
  ) {}

  ngOnInit(): void {
    this.loadPlanningDetails();
  }

  loadPlanningDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de planning non fourni';
      this.loading = false;
      return;
    }

    this.planningService.getPlanningWithReunions(id).subscribe({
      next: (planning) => {
        this.planning = planning;
        this.isCreator = planning.createur._id === this.authService.getCurrentUserId();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement';
        this.loading = false;
        console.error('Erreur:', err);
      }
    });
  }

  editPlanning(): void {
    if (this.planning) {
      this.router.navigate(['/plannings/edit', this.planning._id]);
    }
  }

  deletePlanning(): void {
    if (this.planning && confirm('Supprimer définitivement ce planning ?')) {
      this.planningService.deletePlanning(this.planning._id).subscribe({
        next: () => {
          this.router.navigate(['/plannings']);
        },
        error: (err) => {
          this.error = err.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }
}